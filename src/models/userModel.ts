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

  // Method to update user details
  async update(
    uid: string,
    updates: Partial<UserAttributes>
  ): Promise<UserAttributes> {
    const { first_name, last_name, email, user_type } = updates;

    // Build the update query dynamically based on provided fields
    const fields = [];
    const values = [];
    let index = 1;

    if (first_name !== undefined) {
      fields.push(`first_name = $${index++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push(`last_name = $${index++}`);
      values.push(last_name);
    }
    if (email !== undefined) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (user_type !== undefined) {
      fields.push(`user_type = $${index++}`);
      values.push(user_type);
    }

    // If no fields to update, throw an error
    if (fields.length === 0) {
      throw new Error(`No fields to update for user with UID: ${uid}`);
    }

    const sql = `
      UPDATE users
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE uid = $${index}
      RETURNING *`;

    values.push(uid);

    const result = await connectionSQLResult(sql, values);

    if (result.rows.length === 0) {
      throw new Error(`Error updating user with UID: ${uid}. User not found.`);
    }

    return result.rows[0];
  }

  async deleteByUID(uid: string): Promise<void> {
    const sql = `DELETE FROM users WHERE uid = $1 RETURNING *`;
    const result = await connectionSQLResult(sql, [uid]);

    if (result.rows.length === 0) {
      throw new Error(`Error deleting user with UID: ${uid}. User not found.`);
    }

    return;
  }
}