package main

import (
	"database/sql"
	"log"
	"net/http"

	"czdd-backend/internal/handlers"
	"czdd-backend/internal/middleware"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

// CORS middleware для обработки запросов с других доменов
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Устанавливаем заголовки CORS
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, ngrok-skip-browser-warning")

		// Обрабатываем preflight запросы
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Передаем управление следующему обработчику
		next.ServeHTTP(w, r)
	})
}

func main() {
	connStr := "host=localhost port=5432 user=postgres password=Zer1703On dbname=czdd sslmode=disable"

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatal("Ошибка проверки подключения к БД:", err)
	}

	log.Println("Подключение к БД успешно установлено")

	go handlers.UpdateTrafficData(db)

	r := mux.NewRouter()
	r.Use(corsMiddleware)

	r.HandleFunc("/login", handlers.LoginHandler(db)).Methods("POST", "OPTIONS")

	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(middleware.AuthMiddleware)
	protected.Use(corsMiddleware)

	// Добавляем маршруты
	protected.HandleFunc("/traffic/analyze", handlers.AnalyzeTrafficVideoHandler(db)).Methods("GET")
	protected.HandleFunc("/traffic", handlers.GetTrafficDataHandler(db)).Methods("GET")
	protected.HandleFunc("/traffic/averages", handlers.GetAverageTrafficDataHandler(db)).Methods("GET", "OPTIONS")
	protected.HandleFunc("/traffic/high_congestion", handlers.GetHighCongestionTrafficHandler(db)).Methods("GET", "OPTIONS")
	r.HandleFunc("/requests", handlers.AddRequestHandler(db)).Methods("POST", "OPTIONS")
	protected.HandleFunc("/requests", handlers.GetRequestsHandler(db)).Methods("OPTIONS", "GET")
	protected.HandleFunc("/weather", handlers.WeatherHandler).Methods("GET", "OPTIONS")
	protected.HandleFunc("/requests/update_status", handlers.UpdateRequestStatusHandler(db)).Methods("POST")

	log.Println("Сервер запущен на :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
