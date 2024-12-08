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
			INSERT INTO requests (full_name, phone_number, email, message, done)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id;
		`

		var id int
		err = db.QueryRow(query, req.FullName, req.PhoneNumber, req.Email, req.Message, false).Scan(&id)
		if err != nil {
			http.Error(w, "Database insert error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]int{"id": id})
	}
}

func GetRequestsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := `
			SELECT 
				id, 
				full_name, 
				phone_number, 
				email, 
				message, 
				TO_CHAR(created_at, 'DD-MM-YYYY') AS created_date, 
				TO_CHAR(created_at, 'HH24:MI:SS') AS created_time,
				done
			FROM requests
			WHERE done = false
			ORDER BY created_at DESC
			LIMIT 4;
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
			err := rows.Scan(&req.ID, &req.FullName, &req.PhoneNumber, &req.Email, &req.Message, &req.CreatedDate, &req.CreatedTime, &req.Done)
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

func UpdateRequestStatusHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var updateData struct {
			ID   int  `json:"id"`
			Done bool `json:"done"`
		}

		err := json.NewDecoder(r.Body).Decode(&updateData)
		if err != nil {
			http.Error(w, "Invalid request body. JSON is malformed", http.StatusBadRequest)
			return
		}

		query := `
			UPDATE requests
			SET done = $1
			WHERE id = $2;
		`

		_, err = db.Exec(query, updateData.Done, updateData.ID)
		if err != nil {
			http.Error(w, "Database update error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
