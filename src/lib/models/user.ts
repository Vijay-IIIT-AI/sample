import { hash, compare } from 'bcryptjs';
import pool from '../db';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async createUser(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await hash(password, 12);
    const id = uuidv4();
    const now = new Date();

    const [result] = await pool.execute(
      'INSERT INTO users (id, email, password, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, hashedPassword, name, now, now]
    );

    return {
      id,
      email,
      name,
      created_at: now,
      updated_at: now,
    };
  }

  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  }

  static async verifyPassword(user: User, password: string): Promise<boolean> {
    if (!user.password) return false;
    return compare(password, user.password);
  }

  static async updateProfile(userId: string, data: Partial<User>): Promise<void> {
    const updates = Object.entries(data)
      .filter(([key]) => key !== 'id' && key !== 'password')
      .map(([key, value]) => `${key} = ?`);
    
    const values = [...Object.entries(data)
      .filter(([key]) => key !== 'id' && key !== 'password')
      .map(([_, value]) => value), userId];

    await pool.execute(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
  }
} 