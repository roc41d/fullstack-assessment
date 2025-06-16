import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import logger from '../utils/logger';

type DatabaseType = Awaited<ReturnType<typeof open>>;

let db: DatabaseType;

export async function getDb(): Promise<DatabaseType> {
  try {
    if (!db) {
      logger.info('Initializing new database connection...');
      
      const dbPath = path.join(__dirname, '../../data/todos.db');
      logger.debug(`Database path: ${dbPath}`);

      try {
        db = await open({
          filename: dbPath,
          driver: sqlite3.Database
        });
        logger.info('Database connection established successfully.');
      } catch (openError) {
        logger.error('Failed to open database connection:', openError);
        throw new Error('Database connection failed');
      }

      try {
        await db.exec(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TRIGGER IF NOT EXISTS update_todo_timestamp
          AFTER UPDATE ON todos
          BEGIN
            UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
          END;
        `);
        logger.info('Database schema initialized successfully.');
      } catch (schemaError) {
        logger.error('Failed to initialize database schema:', schemaError);
        throw new Error('Database schema initialization failed');
      }
    }

    logger.debug('Returning database connection');
    return db;
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error; // Re-throw for calling code to handle
  }
}
