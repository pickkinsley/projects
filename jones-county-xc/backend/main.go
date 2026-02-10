package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	dbsqlc "jones-county-xc/backend/db/sqlc"
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

	queries := dbsqlc.New(db)

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

	// Athletes endpoint — using sqlc generated code
	athletesHandler := corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		// Handle /api/athletes/{id} pattern
		if rest := strings.TrimPrefix(r.URL.Path, "/api/athletes/"); rest != r.URL.Path {
			id, err := strconv.ParseInt(rest, 10, 32)
			if err != nil {
				http.Error(w, "invalid athlete id", http.StatusBadRequest)
				return
			}
			row, err := queries.GetAthleteByID(context.Background(), int32(id))
			if err == sql.ErrNoRows {
				http.Error(w, "athlete not found", http.StatusNotFound)
				return
			}
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(Athlete{
				ID:             int(row.ID),
				Name:           row.Name,
				Grade:          int(row.Grade),
				PersonalRecord: row.PersonalRecord,
				Events:         row.Events,
			})
			return
		}

		rows, err := queries.ListAthletes(context.Background())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		athletes := make([]Athlete, len(rows))
		for i, row := range rows {
			athletes[i] = Athlete{
				ID:             int(row.ID),
				Name:           row.Name,
				Grade:          int(row.Grade),
				PersonalRecord: row.PersonalRecord,
				Events:         row.Events,
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(athletes)
	})
	http.HandleFunc("/api/athletes", athletesHandler)
	http.HandleFunc("/api/athletes/", athletesHandler)

	// Meets endpoint — using sqlc generated code
	http.HandleFunc("/api/meets", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		rows, err := queries.ListMeets(context.Background())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		meets := make([]Meet, len(rows))
		for i, row := range rows {
			meets[i] = Meet{
				ID:          int(row.ID),
				Name:        row.Name,
				Date:        row.Date.Format("2006-01-02"),
				Location:    row.Location,
				Description: row.Description,
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(meets)
	}))

	// Results endpoint
	resultsHandler := corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		// Handle /api/results/meet/{id} pattern
		if rest := strings.TrimPrefix(r.URL.Path, "/api/results/meet/"); rest != r.URL.Path {
			meetID, err := strconv.ParseInt(rest, 10, 32)
			if err != nil {
				http.Error(w, "invalid meet id", http.StatusBadRequest)
				return
			}
			dbResults, err := queries.ListResultsByMeet(context.Background(), int32(meetID))
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			results := make([]Result, len(dbResults))
			for i, r := range dbResults {
				results[i] = Result{
					ID:        int(r.ID),
					AthleteID: int(r.AthleteID),
					MeetID:    int(r.MeetID),
					Time:      r.Time,
					Place:     int(r.Place),
				}
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(results)
			return
		}

		// Default: list all results
		dbRows, err := db.Query("SELECT id, athlete_id, meet_id, time, place FROM results")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer dbRows.Close()

		results := []Result{}
		for dbRows.Next() {
			var res Result
			if err := dbRows.Scan(&res.ID, &res.AthleteID, &res.MeetID, &res.Time, &res.Place); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			results = append(results, res)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	})
	http.HandleFunc("/api/results", resultsHandler)
	http.HandleFunc("/api/results/", resultsHandler)

	// Top 10 fastest times across all meets — using sqlc generated code
	http.HandleFunc("/api/results/fastest", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		type FastestTime struct {
			AthleteName string `json:"athleteName"`
			MeetName    string `json:"meetName"`
			Time        string `json:"time"`
			Place       int    `json:"place"`
		}

		rows, err := queries.ListFastestTimes(context.Background())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		times := make([]FastestTime, len(rows))
		for i, row := range rows {
			times[i] = FastestTime{
				AthleteName: row.AthleteName,
				MeetName:    row.MeetName,
				Time:        row.Time,
				Place:       int(row.Place),
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(times)
	}))

	// Top 5 fastest personal records — raw SQL (JOIN-style query)
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

	// Results for the most recent meet — kept as separate handler for clarity
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

	// Athlete's complete race history — raw SQL (JOIN query)
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
