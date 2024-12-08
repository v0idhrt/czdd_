package models

type Request struct {
	ID          int    `json:"id"`           // Уникальный идентификатор обращения
	FullName    string `json:"full_name"`    // Полное имя
	PhoneNumber string `json:"phone_number"` // Номер телефона
	Email       string `json:"email"`        // Электронная почта
	Message     string `json:"message"`      // Сообщение обращения
	CreatedDate string `json:"created_date"` // Дата создания обращения
	CreatedTime string `json:"created_time"` // Время создания обращения
	Done        bool   `json:"done"`         // Статус обращения (по умолчанию false)
}
