package models

// GraphQLQuery структура для отправки GraphQL запросов
type GraphQLQuery struct {
	Query string `json:"query"`
}

// WeatherNow структура для обработки данных текущей погоды
type WeatherNow struct {
	Condition   string `json:"condition"`
	Temperature int    `json:"temperature"`
}

// WeatherResponse структура для обработки ответа от GraphQL API Яндекс Погоды
type WeatherResponse struct {
	Data struct {
		WeatherByPoint struct {
			Now WeatherNow `json:"now"`
		} `json:"weatherByPoint"`
	} `json:"data"`
}
