import { query } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  username: string;
  password: string;
  created_at: Date;
}

export interface UserCreate {
  username: string;
  password: string;
}

export class UserModel {
  static async create(userData: UserCreate): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const result = await query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at',
      [userData.username, hashedPassword]
    );

    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await query(
      'SELECT id, username, created_at FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
