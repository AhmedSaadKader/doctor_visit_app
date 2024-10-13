import { connectionSQLResult } from '../utils/sql_query';

interface DoctorSchedule {
  doctor_id: string;
  day_of_week: string;
  start_time: string; // PostgreSQL TIME can be represented as string
  end_time: string; // PostgreSQL TIME can be represented as string
  created_at: Date;
  updated_at: Date;
}

class DoctorScheduleModel {
  tableName: string;

  constructor() {
    this.tableName = 'doctorSchedule';
  }

  async createSchedule(
    doctor_id: string,
    day_of_week: string,
    start_time: string,
    end_time: string
  ): Promise<DoctorSchedule> {
    const query = `
      INSERT INTO ${this.tableName} (doctor_id, day_of_week, start_time, end_time, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [doctor_id, day_of_week, start_time, end_time];
    const result = await connectionSQLResult(query, values);
    return result.rows[0] as DoctorSchedule;
  }

  async getSchedulesByDoctor(doctor_id: string): Promise<DoctorSchedule[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE doctor_id = $1;
    `;
    const values = [doctor_id];
    const result = await connectionSQLResult(query, values);
    return result.rows as DoctorSchedule[];
  }

  async updateSchedule(
    doctor_id: string,
    day_of_week: string,
    start_time: string,
    updatedFields: Partial<
      Omit<DoctorSchedule, 'doctor_id' | 'day_of_week' | 'start_time'>
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
      WHERE doctor_id = $${fields.length + 1} AND day_of_week = $${fields.length + 2} AND start_time = $${fields.length + 3}
      RETURNING *;
    `;
    values.push(doctor_id, day_of_week, start_time);
    const result = await connectionSQLResult(query, values);
    return result.rows[0] ? (result.rows[0] as DoctorSchedule) : null;
  }

  async deleteSchedule(
    doctor_id: string,
    day_of_week: string,
    start_time: string
  ): Promise<DoctorSchedule | null> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE doctor_id = $1 AND day_of_week = $2 AND start_time = $3
      RETURNING *;
    `;
    const values = [doctor_id, day_of_week, start_time];
    const result = await connectionSQLResult(query, values);
    return result.rows[0] ? (result.rows[0] as DoctorSchedule) : null;
  }
}

export default new DoctorScheduleModel();
