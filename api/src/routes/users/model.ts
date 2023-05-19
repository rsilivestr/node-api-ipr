import pool from '../../pool';
import { UserData } from './types';

export class UserModel {
  static async findOne(id: string): Promise<UserData | undefined> {
    const { rows } = await pool.query(
      `SELECT id, login, name, surname, avatar, is_admin, created_at
      FROM users
      WHERE id=$1`,
      [id]
    );
    return rows[0];
  }
}
