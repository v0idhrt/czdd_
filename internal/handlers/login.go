package handlers

import (
	"czdd-backend/internal/models"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

// Секретный ключ для подписи JWT
var jwtSecret = []byte("jasdjsadnjasnjk")

// LoginHandler обработчик для аутентификации
func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var authRequest models.AuthRequest

		// Декодируем JSON-запрос
		err := json.NewDecoder(r.Body).Decode(&authRequest)
		if err != nil || authRequest.Username == "" || authRequest.Password == "" {
			http.Error(w, "Invalid request body. Username and password are required", http.StatusBadRequest)
			return
		}

		// Запрос к базе данных для получения хэша пароля
		var storedHash string
		query := `SELECT password_hash FROM operators WHERE username = $1`
		err = db.QueryRow(query, authRequest.Username).Scan(&storedHash)
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		} else if err != nil {
			http.Error(w, "Database query error", http.StatusInternalServerError)
			return
		}

		// Проверяем введенный пароль с хэшем из базы данных
		err = bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(authRequest.Password))
		if err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		// Создаем JWT-токен
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"username": authRequest.Username,
			"exp":      time.Now().Add(time.Hour * 1).Unix(), // Токен действует 1 час
		})

		tokenString, err := token.SignedString(jwtSecret)
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		// Возвращаем токен
		response := models.AuthResponse{Token: tokenString}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	}
}
