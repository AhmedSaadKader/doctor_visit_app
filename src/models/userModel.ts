import { connectionSQLResult } from '../utils/sql_query';

interface UserAttributes {
  uid: string;
  first_name?: string;
  last_name?: string;
  email: string;
  user_type: 'doctor' | 'patient';
  created_at?: Date;
  updated_at?: Date;
}

export class UserModel {
  // Method to create a new user
  async create(userData: UserAttributes): Promise<UserAttributes> {
    const { uid, first_name, last_name, email, user_type } = userData;
    const sql = `
      INSERT INTO users (uid, first_name, last_name, email, user_type)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`;
    const result = await connectionSQLResult(sql, [
      uid,
      first_name || null,
      last_name || null,
      email,
      user_type
    ]);

    if (result.rows.length === 0) {
      throw new Error(`Error creating user with email: ${email}`);
    }

    return result.rows[0];
  }

  // Method to find a user by uid
  async findByUID(uid: string): Promise<UserAttributes | null> {
    const sql = `SELECT * FROM users WHERE uid = $1`;
    const result = await connectionSQLResult(sql, [uid]);

    return result.rows.length > 0 ? result.rows[0] : null;
  }
}
