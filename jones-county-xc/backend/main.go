package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func main() {
	// Enable CORS for frontend development
	corsMiddleware := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next(w, r)
		}
	}

	// Root endpoint
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html")
		w.Write([]byte("<h1>Jones County XC API</h1><p>Endpoints:</p><ul><li><a href='/api/health'>/api/health</a></li><li><a href='/api/hello'>/api/hello</a></li><li><a href='/api/athletes'>/api/athletes</a></li></ul>"))
	})

	// Health check endpoint
	http.HandleFunc("/api/health", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status": "ok",
		})
	}))

	// Example API endpoint
	http.HandleFunc("/api/hello", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "Hello from Jones County XC backend!",
		})
	}))

	// Athletes endpoint
	http.HandleFunc("/api/athletes", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		type Athlete struct {
			ID             int    `json:"id"`
			Name           string `json:"name"`
			Grade          int    `json:"grade"`
			PersonalRecord string `json:"personalRecord"`
		}

		athletes := []Athlete{
			{ID: 1, Name: "Jake Thompson", Grade: 11, PersonalRecord: "16:42"},
			{ID: 2, Name: "Marcus Rivera", Grade: 12, PersonalRecord: "16:15"},
			{ID: 3, Name: "Ethan Williams", Grade: 10, PersonalRecord: "17:30"},
			{ID: 4, Name: "Noah Carter", Grade: 9, PersonalRecord: "18:05"},
			{ID: 5, Name: "Liam Johnson", Grade: 11, PersonalRecord: "17:12"},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(athletes)
	}))

	log.Println("Backend server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
