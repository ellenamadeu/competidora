import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../.env') });

console.log('Loading DB config...');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'competid4c3793e0_node',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};
console.log('Using config:', JSON.stringify({ ...dbConfig, password: '***' }));

export const pool = mysql.createPool(dbConfig);
