const mysql = require('mysql2');
require('dotenv').config();

console.log('Attempting to connect to:', process.env.DATABASE_HOST);

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABSE_PASSWORD,
    database: 'defaultdb',
    port: process.env.DATABASE_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
    } else {
        console.log('Connection successful!');
    }
    process.exit();
});
