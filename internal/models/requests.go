package models

type Request struct {
	FullName    string `json:"full_name"`
	PhoneNumber string `json:"phone_number"`
	Email       string `json:"email"`
	Message     string `json:"message"`
	CreatedDate string `json:"created_date"`
	CreatedTime string `json:"created_time"`
}
