CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(255) NOT NULL,
    doctor_id VARCHAR(255) NOT NULL,
    schedule_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(uid),
    FOREIGN KEY (doctor_id) REFERENCES doctors(user_uid),
    FOREIGN KEY (schedule_id) REFERENCES doctorSchedule(id)
);
