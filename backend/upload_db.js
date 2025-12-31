const mysql = require('mysql2');

// 🔄 WE SWITCHED TO 'createPool' TO FIX THE CRASH
const db = mysql.createPool({
    host: "mysql-245f1ff5-coffee-shop-online-ordering.h.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_tS4Zn6z4Kp9hnjGUk0G",
    database: "defaultdb",
    port: 10608,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10, // Allows 10 users at once without crashing
    queueLimit: 0,
    multipleStatements: true
});

// Using a pool means you DO NOT need "db.connect()". It connects automatically.

module.exports = db;