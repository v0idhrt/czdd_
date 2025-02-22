package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"path"
	"path/filepath"
	"strings"
	"time"

	"czdd-backend/internal/models"
)

func AnalyzeTrafficVideoHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		pythonURL := "http://127.0.0.1:5000/current_traffic_state" // URL Python-сервиса
		resp, err := http.Get(pythonURL)
		if err != nil {
			http.Error(w, "Ошибка запроса к Python-сервису", http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()

		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, "Ошибка чтения ответа от Python-сервиса", http.StatusInternalServerError)
			return
		}

		var trafficData map[string]struct {
			AverageSpeed   float64 `json:"average_speed"`
			TrafficDensity float64 `json:"traffic_density"`
		}
		if err := json.Unmarshal(body, &trafficData); err != nil {
			http.Error(w, "Ошибка обработки данных от Python-сервиса", http.StatusInternalServerError)
			return
		}

		timestamp := time.Now()

		for videoPath, data := range trafficData {
			roadName := filepath.Base(videoPath)
			query := `
				INSERT INTO traffic_data (road_name, timestamp, congestion_level, average_speed)
				VALUES ($1, $2, $3, $4)
				ON CONFLICT (road_name) DO UPDATE
				SET timestamp = EXCLUDED.timestamp,
				    congestion_level = EXCLUDED.congestion_level,
				    average_speed = EXCLUDED.average_speed;
			`

			_, err := db.Exec(query, roadName, timestamp, int(data.TrafficDensity), data.AverageSpeed)
			if err != nil {
				http.Error(w, fmt.Sprintf("Ошибка сохранения данных в БД: %v", err), http.StatusInternalServerError)
				return
			}
		}

		// Ответ клиенту
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status": "Данные о трафике успешно обновлены"}`))
	}
}

// GetTrafficDataHandler обработчик для получения данных о трафике
func GetTrafficDataHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		roadName := r.URL.Query().Get("road_name")
		if roadName == "" {
			http.Error(w, "road_name is required", http.StatusBadRequest)
			return
		}

		query := `
			SELECT road_name, timestamp, congestion_level, average_speed
			FROM traffic_data
			WHERE road_name = $1
			ORDER BY timestamp DESC
			LIMIT 1;
		`

		var response models.TrafficResponse
		err := db.QueryRow(query, roadName).Scan(
			&response.RoadName,
			&response.Timestamp,
			&response.CongestionLevel,
			&response.AverageSpeed,
		)
		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "No data found for the specified road", http.StatusNotFound)
			} else {
				http.Error(w, "Database query error", http.StatusInternalServerError)
			}
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func GetAverageTrafficDataHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := `
			SELECT 
				AVG(average_speed) AS avg_speed,
				AVG(congestion_level) AS avg_congestion
			FROM traffic_data;
		`

		var avgSpeed, avgCongestion float64
		err := db.QueryRow(query).Scan(&avgSpeed, &avgCongestion)
		if err != nil {
			http.Error(w, "Ошибка при выполнении запроса к базе данных", http.StatusInternalServerError)
			return
		}

		// Округляем значения
		response := models.AverageTrafficResponse{
			AverageSpeed:      math.Round(avgSpeed),
			AverageCongestion: math.Round(avgCongestion),
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}

func GetHighCongestionTrafficHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := `
			SELECT road_name, latitude, longitude, congestion_level
			FROM traffic_data
			WHERE congestion_level > 5;
		`

		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, "Ошибка при выполнении запроса к базе данных", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var results []models.HighCongestionResponse
		for rows.Next() {
			var response models.HighCongestionResponse
			err := rows.Scan(&response.RoadName, &response.Latitude, &response.Longitude, &response.CongestionLevel)
			if err != nil {
				http.Error(w, "Ошибка чтения данных из базы", http.StatusInternalServerError)
				return
			}
			results = append(results, response)
		}

		if err = rows.Err(); err != nil {
			http.Error(w, "Ошибка обработки данных", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	}
}

func UpdateTrafficData(db *sql.DB) {
	pythonURL := "http://127.0.0.1:5000/current_traffic_state"

	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		fmt.Println("Обновление данных о трафике...")

		resp, err := http.Get(pythonURL)
		if err != nil {
			fmt.Printf("Ошибка запроса к Python-сервису: %v\n", err)
			continue
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			fmt.Printf("Ошибка от Python-сервиса: %s\n", resp.Status)
			continue
		}

		// Чтение ответа от Python-сервиса
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			fmt.Printf("Ошибка чтения ответа от Python-сервиса: %v\n", err)
			continue
		}

		var trafficData map[string]struct {
			AverageSpeed   float64 `json:"average_speed"`
			TrafficDensity float64 `json:"traffic_density"`
		}
		if err := json.Unmarshal(body, &trafficData); err != nil {
			fmt.Printf("Ошибка обработки данных от Python-сервиса: %v\n", err)
			continue
		}

		timestamp := time.Now()

		for videoPath, data := range trafficData {
			roadname := path.Base(videoPath)
			roadname = strings.TrimSuffix(roadname, ".mp4") // Убираем расширение .mp4

			// Вставка данных в основную таблицу
			queryMain := `
				INSERT INTO traffic_data (road_name, timestamp, congestion_level, average_speed)
				VALUES ($1, $2, $3, $4)
				ON CONFLICT (road_name) DO UPDATE
				SET 
					timestamp = EXCLUDED.timestamp,
					congestion_level = EXCLUDED.congestion_level,
					average_speed = EXCLUDED.average_speed
			`

			_, err := db.Exec(queryMain, roadname, timestamp, int(data.TrafficDensity), data.AverageSpeed)
			if err != nil {
				fmt.Printf("Ошибка сохранения данных для %s: %v\n", roadname, err)
				continue
			}

			// Вставка данных в таблицу истории
			queryHistory := `
				INSERT INTO traffic_data_history (road_name, timestamp, congestion_level, average_speed)
				VALUES ($1, $2, $3, $4)
			`

			_, err = db.Exec(queryHistory, roadname, timestamp, int(data.TrafficDensity), data.AverageSpeed)
			if err != nil {
				fmt.Printf("Ошибка сохранения истории данных для %s: %v\n", roadname, err)
				continue
			}
		}

		fmt.Println("Данные о трафике успешно обновлены.")
	}
}
