package models

type AuthRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// AuthResponse структура для ответа
type AuthResponse struct {
	Token string `json:"token"`
}
