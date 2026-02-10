CREATE TABLE athletes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    grade INT NOT NULL,
    personal_record VARCHAR(20),
    events VARCHAR(255)
);

CREATE TABLE meets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    location VARCHAR(255),
    description TEXT
);

CREATE TABLE results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    athlete_id INT NOT NULL,
    meet_id INT NOT NULL,
    time VARCHAR(20) NOT NULL,
    place INT NOT NULL,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (meet_id) REFERENCES meets(id)
);
