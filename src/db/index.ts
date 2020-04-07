require('dotenv').config();
import ConnectionStrings from '../connection/connectionString';
import { Pool } from 'pg';

const pool = new Pool(ConnectionStrings.dbString());

pool.connect()
    .then(() => console.log('Connected to database'))
    .catch(() => console.error('Could not connect to database'))

export default pool;