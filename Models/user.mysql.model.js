const mysql = require('mysql2');
const { connectmySql } = require('../connectDB'); // Make sure your MySQL connection is imported

console.log("step2")
const createUserTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS usersData (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(username) >= 3),  -- Minimum length of 3 characters for username
        email VARCHAR(255) NOT NULL UNIQUE CHECK (email LIKE '%_@__%.__%'), -- Ensures a valid email pattern
        password VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(password) >= 8),  -- Minimum password length of 8 characters
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`;

      
    connectmySql().then((mysqlConnection) => {
        mysqlConnection.query(sql, (err, result) => {
            if (err) {
                console.error('Error creating user table:', err);
                return;
            }
            console.log('User table created or already exists.');
        });
    }).catch((err) => {
        console.error('MySQL connection error:', err);
    });



    
};
// createUserTable();
module.exports = { createUserTable };
