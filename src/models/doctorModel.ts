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

  // Method to get all doctors with user details
  async findAllDoctors(): Promise<any[]> {
    const sql = `
    SELECT u.uid, u.first_name, u.last_name, u.email, u.user_type, u.image_url,
           d.specialty, d.location, d.created_at AS doctor_created_at, d.updated_at AS doctor_updated_at
    FROM users u
    JOIN doctors d ON u.uid = d.user_uid;
    `;
    const result = await connectionSQLResult(sql, []);
    return result.rows;
  }

  // Method to find a doctor by user_uid with joined user details
  async findByUserUID(user_uid: string): Promise<any | null> {
    const sql = `
    SELECT u.uid, u.first_name, u.last_name, u.email, u.user_type, u.image_url,
           d.specialty, d.location, d.created_at AS doctor_created_at, d.updated_at AS doctor_updated_at
    FROM users u
    JOIN doctors d ON u.uid = d.user_uid
    WHERE u.uid = $1;
    `;
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

  async deleteByUserUID(user_uid: string): Promise<void> {
    const sql = `DELETE FROM doctors WHERE user_uid = $1 RETURNING *`;
    const result = await connectionSQLResult(sql, [user_uid]);

    if (result.rows.length === 0) {
      throw new Error(
        `Error deleting doctor with User UID: ${user_uid}. Doctor not found.`
      );
    }

    return;
  }
}
