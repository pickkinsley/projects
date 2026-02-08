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
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Date        string `json:"date"`
	Location    string `json:"location"`
	Description string `json:"description"`
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
		rows, err := db.Query("SELECT id, name, grade, COALESCE(personal_record, ''), COALESCE(events, '') FROM athletes ORDER BY grade")
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
		rows, err := db.Query("SELECT id, name, date, COALESCE(location, ''), COALESCE(description, '') FROM meets")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		meets := []Meet{}
		for rows.Next() {
			var m Meet
			if err := rows.Scan(&m.ID, &m.Name, &m.Date, &m.Location, &m.Description); err != nil {
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

	// Top 5 fastest personal records
	http.HandleFunc("/api/athletes/fastest", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, name, grade, COALESCE(personal_record, ''), COALESCE(events, '') FROM athletes ORDER BY personal_record LIMIT 5")
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

	// Results for the most recent meet
	http.HandleFunc("/api/results/latest", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		type LatestResult struct {
			AthleteName string `json:"athleteName"`
			MeetName    string `json:"meetName"`
			Time        string `json:"time"`
			Place       int    `json:"place"`
		}

		rows, err := db.Query(`
			SELECT a.name, m.name, r.time, r.place
			FROM results r
			JOIN athletes a ON r.athlete_id = a.id
			JOIN meets m ON r.meet_id = m.id
			WHERE m.date = (SELECT MAX(date) FROM meets)
			ORDER BY r.place
		`)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		results := []LatestResult{}
		for rows.Next() {
			var res LatestResult
			if err := rows.Scan(&res.AthleteName, &res.MeetName, &res.Time, &res.Place); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			results = append(results, res)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	}))

	// Athlete's complete race history
	http.HandleFunc("/api/athletes/history", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		athleteID := r.URL.Query().Get("id")
		if athleteID == "" {
			http.Error(w, "missing id query parameter", http.StatusBadRequest)
			return
		}

		type RaceHistory struct {
			MeetName string `json:"meetName"`
			Date     string `json:"date"`
			Time     string `json:"time"`
			Place    int    `json:"place"`
		}

		rows, err := db.Query(`
			SELECT m.name, m.date, r.time, r.place
			FROM results r
			JOIN meets m ON r.meet_id = m.id
			WHERE r.athlete_id = ?
			ORDER BY m.date
		`, athleteID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		history := []RaceHistory{}
		for rows.Next() {
			var h RaceHistory
			if err := rows.Scan(&h.MeetName, &h.Date, &h.Time, &h.Place); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			history = append(history, h)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(history)
	}))

	log.Println("Backend server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
