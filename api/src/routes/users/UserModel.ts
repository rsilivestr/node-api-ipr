import { hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import pool from '../../pool';
import { UserCreateData, UserCreateResponse, UserData } from './types';
import { issueTokens } from 'routes/auth/utils';

const SALT_ROUNDS = 10;

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

  static async create({
    login,
    password,
    name,
    surname,
    avatar,
  }: UserCreateData): Promise<UserCreateResponse | undefined> {
    const existingUsers = await pool.query('SELECT login FROM users WHERE login=$1', [login]);

    if (existingUsers.rowCount > 0) return;

    const passwordHash = await hash(password, SALT_ROUNDS);
    await pool.query('INSERT INTO users (login, passwd_hash, name, surname, avatar) VALUES ($1, $2, $3, $4, $5)', [
      login,
      passwordHash,
      name,
      surname,
      avatar,
    ]);
    const tokens = await issueTokens(login);

    return tokens;
  }

  static async delete(id: string): Promise<boolean> {
    console.debug(id);
    const { rowCount } = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);

    return rowCount === 1;
  }
}
