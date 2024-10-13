import { connectionSQLResult } from '../utils/sql_query';
import DoctorScheduleModel from './doctorScheduleModel';

interface Appointment {
  id: number;
  patient_id: string;
  doctor_id: string;
  schedule_id: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

class AppointmentModel {
  tableName: string;

  constructor() {
    this.tableName = 'appointments';
  }

  // Create a new appointment
  async createAppointment(
    patient_id: string,
    doctor_id: string,
    schedule_id: number,
    status = 'pending'
  ): Promise<Appointment> {
    const query = `
      INSERT INTO ${this.tableName} (patient_id, doctor_id, schedule_id, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [patient_id, doctor_id, schedule_id, status];
    const result = await connectionSQLResult(query, values);
    const appointment = result.rows[0] as Appointment;
    await DoctorScheduleModel.updateSchedule(schedule_id, {
      status: 'reserved'
    });

    return appointment;
  }

  // Get appointments by patient ID
  async getAppointmentsByPatient(patient_id: string): Promise<Appointment[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE patient_id = $1;
    `;
    const values = [patient_id];
    const result = await connectionSQLResult(query, values);
    return result.rows as Appointment[];
  }

  // Get appointments by doctor ID
  async getAppointmentsByDoctor(doctor_id: string): Promise<Appointment[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE doctor_id = $1;
    `;
    const values = [doctor_id];
    const result = await connectionSQLResult(query, values);
    return result.rows as Appointment[];
  }

  // Update appointment status
  async updateAppointmentStatus(
    id: number,
    status: string
  ): Promise<Appointment | null> {
    const query = `
      UPDATE ${this.tableName}
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, id];
    const result = await connectionSQLResult(query, values);
    return result.rows[0] ? (result.rows[0] as Appointment) : null;
  }

  // Delete an appointment
  async deleteAppointment(id: number): Promise<Appointment | null> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id];
    const result = await connectionSQLResult(query, values);
    return result.rows[0] ? (result.rows[0] as Appointment) : null;
  }
}

export default new AppointmentModel();
