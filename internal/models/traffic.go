package models

type TrafficEntity struct {
	EntityType string  `json:"entity_type"`
	X          int     `json:"x"`
	Y          int     `json:"y"`
	Width      int     `json:"width"`
	Height     int     `json:"height"`
	Confidence float64 `json:"confidence"`
}

type TrafficResponse struct {
	RoadName        string  `json:"road_name"`
	Timestamp       string  `json:"timestamp"`
	CongestionLevel int     `json:"congestion_level"`
	AverageSpeed    float64 `json:"average_speed"`
}

type AverageTrafficResponse struct {
	AverageSpeed      float64 `json:"average_speed"`
	AverageCongestion float64 `json:"average_congestion"`
}

type HighCongestionResponse struct {
	RoadName        string  `json:"road_name"`
	Latitude        float64 `json:"latitude"`
	Longitude       float64 `json:"longitude"`
	CongestionLevel int     `json:"congestion_level"`
}
