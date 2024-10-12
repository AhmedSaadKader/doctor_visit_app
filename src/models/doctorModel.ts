import { connectionSQLResult } from '../utils/sql_query';

interface DoctorAttributes {
  user_uid: string;
  specialty?: string;
  location?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class DoctorModel {
  // Method to create a new doctor
  async create(doctorData: DoctorAttributes): Promise<DoctorAttributes> {
    const { user_uid, specialty, location } = doctorData;
    const sql = `
      INSERT INTO doctors (user_uid, specialty, location)
      VALUES ($1, $2, $3) 
      RETURNING *`;
    const result = await connectionSQLResult(sql, [
      user_uid,
      specialty || null,
      location || null
    ]);

    if (result.rows.length === 0) {
      throw new Error(`Error creating doctor for user: ${user_uid}`);
    }

    return result.rows[0];
  }

  // Method to find a doctor by user_uid
  async findByUserUID(user_uid: string): Promise<DoctorAttributes | null> {
    const sql = `SELECT * FROM doctors WHERE user_uid = $1`;
    const result = await connectionSQLResult(sql, [user_uid]);

    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Method to update a doctor's information
  async update(
    user_uid: string,
    updates: Partial<DoctorAttributes>
  ): Promise<DoctorAttributes> {
    const { specialty, location } = updates;
    const sql = `
      UPDATE doctors
      SET specialty = COALESCE($2, specialty), location = COALESCE($3, location), updated_at = CURRENT_TIMESTAMP
      WHERE user_uid = $1
      RETURNING *`;
    const result = await connectionSQLResult(sql, [
      user_uid,
      specialty || null,
      location || null
    ]);

    if (result.rows.length === 0) {
      throw new Error(`Error updating doctor for user: ${user_uid}`);
    }

    return result.rows[0];
  }
}
