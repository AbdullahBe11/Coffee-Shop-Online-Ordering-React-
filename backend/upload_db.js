// backend/upload_db.js
//final db fix
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
    host: "mysql-245f1ff5-coffee-shop-online-ordering.h.aivencloud.com", // COPY FROM AIVEN
    user: "avnadmin",
    password: "AVNS_tS4Zn6z4Kp9hnjGUk0G", // COPY FROM AIVEN
    database: "defaultdb",
    port: 10608, // <--- MAKE SURE THIS IS THE AIVEN PORT (NOT 3306)
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
});
// ... rest of the code stays the same