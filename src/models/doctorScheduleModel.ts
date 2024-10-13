import { connectionSQLResult } from '../utils/sql_query';

interface DoctorSchedule {
  id: number;
  doctor_id: string;
  day_of_week: string;
  start_time: string; // PostgreSQL TIME can be represented as string
  end_time: string; // PostgreSQL TIME can be represented as string
  status: string; // New field to track 'available', 'reserved', etc.
  created_at: Date;
  updated_at: Date;
}

class DoctorScheduleModel {
  tableName: string;

  constructor() {
    this.tableName = 'doctorSchedule';
  }

  // Create a schedule entry with default status as 'available'
  async createSchedule(
    doctor_id: string,
    day_of_week: string,
    start_time: string,
    end_time: string,
    status: string = 'available' // Default status
  ): Promise<DoctorSchedule> {
    const query = `
      INSERT INTO ${this.tableName} (doctor_id, day_of_week, start_time, end_time, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [doctor_id, day_of_week, start_time, end_time, status];
    const result = await connectionSQLResult(query, values);
    return result.rows[0] as DoctorSchedule;
  }

  // Fetch schedules by doctor using doctor_id
  async getSchedulesByDoctor(doctor_id: string): Promise<DoctorSchedule[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE doctor_id = $1;
    `;
    const values = [doctor_id];
    const result = await connectionSQLResult(query, values);
    return result.rows as DoctorSchedule[];
  }

  // Update a schedule by schedule ID, and allow status or other fields to be updated
  async updateSchedule(
    id: number,
    updatedFields: Partial<
      Omit<DoctorSchedule, 'id' | 'doctor_id' | 'created_at'>
    >
  ): Promise<DoctorSchedule | null> {
    const fields = Object.keys(updatedFields) as Array<keyof DoctorSchedule>;
    const values = Object.values(updatedFields);
    const setClause = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
      RETURNING *;
    `;
    values.push(String(id));
    const result = await connectionSQLResult(query, values);
    return result.rows[0] ? (result.rows[0] as DoctorSchedule) : null;
  }

  // Delete a schedule by schedule ID
  async deleteSchedule(id: number): Promise<DoctorSchedule | null> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id];
    const result = await connectionSQLResult(query, values);
    return result.rows[0] ? (result.rows[0] as DoctorSchedule) : null;
  }

  // Mark a schedule as reserved by ID when creating an appointment
  async markScheduleAsReserved(id: number): Promise<DoctorSchedule | null> {
    const query = `
      UPDATE ${this.tableName}
      SET status = 'reserved', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id];
    const result = await connectionSQLResult(query, values);
    return result.rows[0] ? (result.rows[0] as DoctorSchedule) : null;
  }
}

export default new DoctorScheduleModel();
