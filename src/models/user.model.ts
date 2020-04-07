import db from '../db/index';

module.exports = () => {
    const createUsersTable = async () => {
        try {
            await db.query(
                `CREATE TABLE IF NOT EXISTS users(
                    user_id serial PRIMARY KEY,
                    first_name VARCHAR(100) NOT NULL,
                    last_name VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password TEXT NOT NULL
                )`
            );
        } catch (error) {
            console.log('error');
        }
    };
    createUsersTable();
};