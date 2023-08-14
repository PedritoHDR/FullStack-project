const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT
});

const postUser = async (email, nombre, password, favorite_gender, favorite_song, birthday, country, foto) => {
    const request = {
        text: 'INSERT INTO users (email, name, password, favorite_gender, favorite_song, born_date, country, picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING*;',
        values: [email, nombre, password, favorite_gender, favorite_song, birthday, country, foto] 
    };
    const res = await pool.query(request);
    return res.rows[0];
};

const getUsers = async (email) => {
    const request = {
        text: `SELECT * FROM users WHERE email = $1;`,
        values: [email]
    };
    const { rows } = await pool.query(request);
    return rows[0];
};

module.exports = {
    postUser
}