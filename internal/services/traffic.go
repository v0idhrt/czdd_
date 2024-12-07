package services

import (
    "bytes"
    "encoding/json"
    "mime/multipart"
    "net/http"
    "os"

    "czdd-backend/internal/models"
)

func ProcessTrafficVideo(videoPath string) ([]models.TrafficEntity, error) {
    videoData, err := os.ReadFile(videoPath)
    if err != nil {
        return nil, err
    }

    body := new(bytes.Buffer)
    writer := multipart.NewWriter(body)
    part, err := writer.CreateFormFile("video", "video.mp4")
    if err != nil {
        return nil, err
    }
    part.Write(videoData)
    writer.Close()

    req, err := http.NewRequest("POST", "http://analyzer:5000/analyze", body)
    if err != nil {
        return nil, err
    }
    req.Header.Set("Content-Type", writer.FormDataContentType())

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var entities []models.TrafficEntity
    if err := json.NewDecoder(resp.Body).Decode(&entities); err != nil {
        return nil, err
    }

    return entities, nil
}
