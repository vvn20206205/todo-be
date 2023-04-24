const mysql = require('mysql'); 
require('dotenv').config()
// Tạo kết nối MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database successfully!');
});
module.exports = {connection,};
