const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));


const dbOptions = {
    host: process.env.DB_HOST || "mysql-245f1ff5-coffee-shop-online-ordering.h.aivencloud.com", 
    user: process.env.DB_USER || "avnadmin",
    password: process.env.DB_PASSWORD || "AVNS_tS4Zn6z4Kp9hnjGUk0G", 
    database: process.env.DB_NAME || "defaultdb",
    port: process.env.DB_PORT || 10608,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
};


if (process.env.DB_CA_BASE64) {
  try {
    const caPath = path.join(__dirname, 'aiven-ca.pem');
    fs.writeFileSync(caPath, Buffer.from(process.env.DB_CA_BASE64, 'base64'));
    dbOptions.ssl = { ca: fs.readFileSync(caPath) };
    console.log('Loaded DB CA from DB_CA_BASE64');
  } catch (e) {
    console.warn("Failed to write DB_CA_BASE64:", e.message);
  }
} else if (process.env.DB_CA_PATH) {
  try {
    dbOptions.ssl = { ca: fs.readFileSync(process.env.DB_CA_PATH) };
  } catch (e) {
    console.warn("Failed to load DB_CA_PATH:", e.message);
  }
} else {
 
  dbOptions.ssl = { rejectUnauthorized: false };
} 


const db = mysql.createPool(dbOptions);



const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


app.get("/menu", (req, res) => {
    const q = "SELECT * FROM menu";
    db.query(q, (err, data) => {
        if (err) {
            console.error('GET /menu DB error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        return res.json(data);
    });
});


app.get('/health', (req, res) => {
    db.query('SELECT 1', (err) => {
        if (err) {
            console.error('Health check failed:', err);
            return res.status(500).json({ status: 'error', error: err.message });
        }
        return res.json({ status: 'ok' });
    });
});


if (process.env.DEBUG === 'true') {
    app.get('/debug', (req, res) => {
        return res.json({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME });
    });
}


app.get('/search/:id', (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM menu WHERE id = ?";
    db.query(q, [id], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


app.post("/create", upload.single('image'), (req, res) => {
    const q = "INSERT INTO menu(`name`, `price`, `image`) VALUES (?,?,?)";
    
    const imageFilename = req.file ? req.file.filename : ""; 

    db.query(q, [req.body.name, req.body.price, imageFilename], (err, data) => {
        if (err) return res.send(err);
        return res.json("Item created successfully");
    });
});


app.delete("/menu/:id", (req, res) => {
    const id = req.params.id;

    
    const qGetImage = "SELECT image FROM menu WHERE id = ?";
    db.query(qGetImage, [id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Item not found");

        const imageFileName = data[0].image;

        
        const qDelete = "DELETE FROM menu WHERE id = ?";
        db.query(qDelete, [id], (err2, data2) => {
            if (err2) return res.status(500).json(err2);

            
            if (imageFileName) {
                const filePath = path.join(__dirname, "images", imageFileName);
                fs.unlink(filePath, (err3) => {
                    if (err3) console.log("Could not delete file (maybe it didn't exist): " + err3);
                });
            }
            return res.json("Item has been deleted");
        });
    });
});


app.post("/modify/:id", upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { name, price } = req.body;
    
    let q = "";
    let values = [];

    if (req.file) {
        
        q = "UPDATE menu SET `name`= ?, `price`= ?, `image` = ? WHERE id = ?";
        values = [name, price, req.file.filename, id];
    } else {
        
        q = "UPDATE menu SET `name`= ?, `price`= ? WHERE id = ?";
        values = [name, price, id];
    }

    db.query(q, values, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


app.post("/orders", (req, res) => {
    const { customer_name, total_amount, items } = req.body;

    const qOrder = "INSERT INTO orders (customer_name, total_amount) VALUES (?, ?)";
    db.query(qOrder, [customer_name, total_amount], (err, result) => {
        if (err) return res.json(err);
        
        const orderId = result.insertId;
        const qItems = "INSERT INTO order_items (order_id, menu_id, quantity) VALUES ?";
        const values = items.map(item => [orderId, item.menu_id, item.quantity]);

        db.query(qItems, [values], (err, result) => {
            if (err) return res.json(err);
            return res.json({ message: "Order placed successfully!", orderId });
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});