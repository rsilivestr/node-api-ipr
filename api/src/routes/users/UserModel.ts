import { hash } from 'bcrypt';

import db from 'db';
import { issueTokens } from 'routes/auth/utils';

import { UserCreateData, UserCreateResponse, UserData } from './types';

const SALT_ROUNDS = 10;

export class UserModel {
  static async findOne(id: string): Promise<UserData | undefined> {
    const { rows } = await db.query(
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
    const existingUsers = await db.query('SELECT login FROM users WHERE login=$1', [login]);

    if (existingUsers.rowCount > 0) return;

    const passwordHash = await hash(password, SALT_ROUNDS);
    await db.query('INSERT INTO users (login, passwd_hash, name, surname, avatar) VALUES ($1, $2, $3, $4, $5)', [
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
    const { rowCount } = await db.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);

    return rowCount === 1;
  }
}
