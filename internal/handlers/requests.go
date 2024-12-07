package handlers

import (
	"czdd-backend/internal/models"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
)

func AddRequestHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.Request

		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Invalid request body. JSON is malformed", http.StatusBadRequest)
			return
		}

		req.FullName = strings.TrimSpace(req.FullName)
		req.PhoneNumber = strings.TrimSpace(req.PhoneNumber)
		req.Email = strings.TrimSpace(req.Email)
		req.Message = strings.TrimSpace(req.Message)

		if req.FullName == "" || req.PhoneNumber == "" || req.Email == "" || req.Message == "" {
			http.Error(w, "All fields are required and must not be empty or whitespace", http.StatusBadRequest)
			return
		}

		query := `
			INSERT INTO requests (full_name, phone_number, email, message)
			VALUES ($1, $2, $3, $4);
		`

		_, err = db.Exec(query, req.FullName, req.PhoneNumber, req.Email, req.Message)
		if err != nil {
			http.Error(w, "Database insert error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func GetRequestsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// SQL-запрос для выборки данных с форматированием
		query := `
			SELECT 
				full_name, 
				phone_number, 
				email, 
				message, 
				TO_CHAR(created_at, 'DD-MM-YYYY') AS created_date, 
				TO_CHAR(created_at, 'HH24:MI:SS') AS created_time
			FROM requests
			ORDER BY created_at DESC;
		`

		rows, err := db.Query(query)
		if err != nil {
			http.Error(w, "Database query error", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var requests []models.Request
		for rows.Next() {
			var req models.Request
			err := rows.Scan(&req.FullName, &req.PhoneNumber, &req.Email, &req.Message, &req.CreatedDate, &req.CreatedTime)
			if err != nil {
				http.Error(w, "Error reading database result", http.StatusInternalServerError)
				return
			}
			requests = append(requests, req)
		}

		if err = rows.Err(); err != nil {
			http.Error(w, "Error processing database rows", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(requests)
	}
}
