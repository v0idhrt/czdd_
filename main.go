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

func main() {
	// Строка подключения к БД
	connStr := "host=localhost port=5432 user=postgres password=Zer1703On dbname=czdd sslmode=disable"

	// Подключение к базе данных
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}
	defer db.Close()

	// Проверка подключения
	if err = db.Ping(); err != nil {
		log.Fatal("Ошибка проверки подключения к БД:", err)
	}

	log.Println("Подключение к БД успешно установлено")

	go handlers.UpdateTrafficData(db)

	// Создаем маршрутизатор
	r := mux.NewRouter()

	r.HandleFunc("/login", handlers.LoginHandler(db)).Methods("POST")

	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	// Добавляем маршруты
	protected.HandleFunc("/traffic/analyze", handlers.AnalyzeTrafficVideoHandler(db)).Methods("GET")
	protected.HandleFunc("/traffic", handlers.GetTrafficDataHandler(db)).Methods("GET")
	protected.HandleFunc("/traffic/averages", handlers.GetAverageTrafficDataHandler(db)).Methods("GET")
	protected.HandleFunc("/traffic/high_congestion", handlers.GetHighCongestionTrafficHandler(db)).Methods("GET")
	protected.HandleFunc("/requests", handlers.AddRequestHandler(db)).Methods("POST")
	protected.HandleFunc("/requests", handlers.GetRequestsHandler(db)).Methods("GET")
	// Запускаем сервер

	log.Println("Сервер запущен на :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
