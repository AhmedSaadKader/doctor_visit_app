CREATE TABLE doctorSchedule (
    doctor_id VARCHAR(255) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (doctor_id, day_of_week, start_time),
    FOREIGN KEY (doctor_id) REFERENCES doctors(user_uid)
);