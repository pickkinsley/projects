package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

type Athlete struct {
	ID             int    `json:"id"`
	Name           string `json:"name"`
	Grade          int    `json:"grade"`
	PersonalRecord string `json:"personalRecord"`
	Events         string `json:"events"`
}

type Meet struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

type Result struct {
	ID        int    `json:"id"`
	AthleteID int    `json:"athleteId"`
	MeetID    int    `json:"meetId"`
	Time      string `json:"time"`
	Place     int    `json:"place"`
}

func main() {
	db, err := sql.Open("mysql", "root@tcp(127.0.0.1:3306)/jones_county_xc?parseTime=true")
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("Connected to MySQL database")

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
		rows, err := db.Query("SELECT id, name, grade, COALESCE(personal_record, ''), COALESCE(events, '') FROM athletes")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		athletes := []Athlete{}
		for rows.Next() {
			var a Athlete
			if err := rows.Scan(&a.ID, &a.Name, &a.Grade, &a.PersonalRecord, &a.Events); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			athletes = append(athletes, a)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(athletes)
	}))

	// Meets endpoint
	http.HandleFunc("/api/meets", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name, date, COALESCE(location, '') FROM meets")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		meets := []Meet{}
		for rows.Next() {
			var m Meet
			if err := rows.Scan(&m.ID, &m.Name, &m.Date, &m.Location); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			meets = append(meets, m)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(meets)
	}))

	// Results endpoint
	http.HandleFunc("/api/results", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, athlete_id, meet_id, time, place FROM results")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		results := []Result{}
		for rows.Next() {
			var res Result
			if err := rows.Scan(&res.ID, &res.AthleteID, &res.MeetID, &res.Time, &res.Place); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			results = append(results, res)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	}))

	log.Println("Backend server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
