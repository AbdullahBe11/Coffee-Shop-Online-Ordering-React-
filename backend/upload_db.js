const mysql = require('mysql2');


const db = mysql.createPool({
    host: "mysql-245f1ff5-coffee-shop-online-ordering.h.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_tS4Zn6z4Kp9hnjGUk0G",
    database: "defaultdb",
    port: 10608,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0,
    multipleStatements: true
});



module.exports = db;