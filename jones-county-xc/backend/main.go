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
		w.Write([]byte("<h1>Jones County XC API</h1><p>Endpoints:</p><ul><li><a href='/api/health'>/api/health</a></li><li><a href='/api/hello'>/api/hello</a></li><li><a href='/api/athletes'>/api/athletes</a></li><li><a href='/api/meets'>/api/meets</a></li><li><a href='/api/results'>/api/results</a></li></ul>"))
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

	// Meets endpoint
	http.HandleFunc("/api/meets", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		type Meet struct {
			ID       int    `json:"id"`
			Name     string `json:"name"`
			Date     string `json:"date"`
			Location string `json:"location"`
		}

		meets := []Meet{
			{ID: 1, Name: "Jones County Invitational", Date: "2026-09-05", Location: "Jones County Park"},
			{ID: 2, Name: "Region 4 Championship", Date: "2026-09-19", Location: "Cedar Creek Trail"},
			{ID: 3, Name: "Peach State Classic", Date: "2026-10-03", Location: "Peach State Fields"},
			{ID: 4, Name: "State Qualifier", Date: "2026-10-17", Location: "Lakewood Course"},
			{ID: 5, Name: "State Championship", Date: "2026-11-01", Location: "Carrollton Course"},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(meets)
	}))

	// Results endpoint
	http.HandleFunc("/api/results", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		type Result struct {
			ID        int    `json:"id"`
			AthleteID int    `json:"athleteId"`
			MeetID    int    `json:"meetId"`
			Time      string `json:"time"`
			Place     int    `json:"place"`
		}

		results := []Result{
			{ID: 1, AthleteID: 1, MeetID: 1, Time: "17:05", Place: 3},
			{ID: 2, AthleteID: 2, MeetID: 1, Time: "16:38", Place: 1},
			{ID: 3, AthleteID: 3, MeetID: 1, Time: "18:12", Place: 8},
			{ID: 4, AthleteID: 4, MeetID: 1, Time: "18:45", Place: 12},
			{ID: 5, AthleteID: 5, MeetID: 1, Time: "17:30", Place: 5},
			{ID: 6, AthleteID: 1, MeetID: 2, Time: "16:55", Place: 2},
			{ID: 7, AthleteID: 2, MeetID: 2, Time: "16:22", Place: 1},
			{ID: 8, AthleteID: 3, MeetID: 2, Time: "17:48", Place: 6},
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	}))

	log.Println("Backend server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
