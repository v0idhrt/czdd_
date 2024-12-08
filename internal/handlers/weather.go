package handlers

import (
	"bytes"
	"czdd-backend/internal/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func mapWeatherCondition(condition string) string {
	switch condition {
	case "CLEAR":
		return "Sunny"
	case "PARTLY_CLOUDY", "CLOUDY", "OVERCAST":
		return "Cloudy"
	case "LIGHT_RAIN", "RAIN", "HEAVY_RAIN", "SHOWERS", "THUNDERSTORM_WITH_RAIN":
		return "Rainy"
	case "THUNDERSTORM", "THUNDERSTORM_WITH_HAIL":
		return "Thunder"
	case "SLEET", "LIGHT_SNOW", "SNOW", "SNOWFALL", "HAIL":
		return "Snowy"
	case "WINDY": // Если есть значение "Ветренно" в API
		return "Windy"
	default:
		// Резервный случай: выбираем наиболее нейтральное состояние
		return "Cloudy"
	}
}

// WeatherHandler обработчик для получения данных о погоде
func WeatherHandler(w http.ResponseWriter, r *http.Request) {
	// Читаем параметры lat и lon
	lat := 45.041078
	lon := 38.974388

	// Читаем API-ключ
	apiKey := "9fb795f0-7c77-47e5-a304-33a30d416ec3"
	if apiKey == "" {
		http.Error(w, "Yandex Weather API key is not set", http.StatusInternalServerError)
		return
	}

	// Формируем GraphQL запрос
	query := fmt.Sprintf(`
        {
            weatherByPoint(request: {lat: %f, lon: %f}) {
                now {
                    condition
                    temperature
                }
            }
        }
    `, lat, lon)

	graphqlQuery := models.GraphQLQuery{
		Query: query,
	}

	// Сериализуем запрос в JSON
	jsonQuery, err := json.Marshal(graphqlQuery)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error encoding GraphQL query: %v", err), http.StatusInternalServerError)
		return
	}

	// Создаем POST-запрос к API Яндекс Погоды
	apiURL := "https://api.weather.yandex.ru/graphql/query"
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(jsonQuery))
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating request: %v", err), http.StatusInternalServerError)
		return
	}

	// Устанавливаем заголовки
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Yandex-Weather-Key", apiKey)

	// Выполняем запрос
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error sending request to Yandex Weather API: %v", err), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	// Проверяем статус ответа
	if resp.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(resp.Body)
		http.Error(w, fmt.Sprintf("Yandex Weather API error: %s", body), http.StatusBadGateway)
		return
	}

	// Читаем тело ответа
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error reading response body: %v", err), http.StatusInternalServerError)
		return
	}

	// Десериализуем JSON ответ
	var weatherData models.WeatherResponse
	err = json.Unmarshal(body, &weatherData)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error parsing JSON: %v", err), http.StatusInternalServerError)
		return
	}

	// Сопоставляем состояние погоды
	mappedCondition := mapWeatherCondition(weatherData.Data.WeatherByPoint.Now.Condition)

	// Подготовка ответа
	response := map[string]interface{}{
		"temperature": weatherData.Data.WeatherByPoint.Now.Temperature,
		"condition":   mappedCondition,
	}

	// Отправляем ответ клиенту
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
