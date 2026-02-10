-- name: ListAthletes :many
SELECT id, name, grade, COALESCE(personal_record, '') AS personal_record, COALESCE(events, '') AS events
FROM athletes
ORDER BY grade;

-- name: GetAthleteByID :one
SELECT id, name, grade, COALESCE(personal_record, '') AS personal_record, COALESCE(events, '') AS events
FROM athletes
WHERE id = ?;

-- name: ListMeets :many
SELECT id, name, date, COALESCE(location, '') AS location, COALESCE(description, '') AS description
FROM meets;

-- name: ListResultsByMeet :many
SELECT id, athlete_id, meet_id, time, place
FROM results
WHERE meet_id = ?
ORDER BY place;

-- name: CreateResult :execresult
INSERT INTO results (athlete_id, meet_id, time, place)
VALUES (?, ?, ?, ?);
