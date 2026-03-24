import { query } from '../config/database';

export interface Message {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: Date;
}

export interface MessageCreate {
  user_id: number;
  username: string;
  content: string;
}

export class MessageModel {
  static async create(messageData: MessageCreate): Promise<Message> {
    const result = await query(
      'INSERT INTO messages (user_id, username, content) VALUES ($1, $2, $3) RETURNING *',
      [messageData.user_id, messageData.username, messageData.content]
    );

    return result.rows[0];
  }

  static async getRecent(limit: number = 50): Promise<Message[]> {
    const result = await query(
      'SELECT * FROM messages ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    return result.rows.reverse(); // Return in chronological order
  }

  static async getAll(): Promise<Message[]> {
    const result = await query(
      'SELECT * FROM messages ORDER BY created_at ASC'
    );

    return result.rows;
  }
}
