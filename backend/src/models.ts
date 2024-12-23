import { pool } from './config';

export const getEvents = async () => {
    const result = await pool.query('SELECT * FROM events');
    return result.rows;
};