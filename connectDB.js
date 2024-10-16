const mongoose = require('mongoose');
const mysql = require('mysql2')
require('dotenv').config();



console.log("step6")
async function connectionDB() {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("db connect successfully");

    } catch (error) {
        console.log("dbconnection error", error);
    }
}

// console.log('host name is ', process.env.MYSQL_PASSWORD)
async function connectmySql() {
    return new Promise((resolve, reject) => {
        const mysqlConnection = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        mysqlConnection.connect((err) => {
            if (err) {
                // console.log('MySQL connection error:', err);
                console.log('MySQL connection error:', err);
                reject(err);
            } else {
                // console.log('MySQL connected successfully');
                resolve(mysqlConnection);
            }
        });
    });
}

module.exports = {connectmySql,connectionDB };