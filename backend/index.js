const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();


app.use(cors());
app.use(express.json());


app.use("/images", express.static(path.join(__dirname, "images")));


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT,
    ssl:{rejectUnauthorized:false},
});


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
        if (err) return res.json(err);
        return res.json(data);
    });
});


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

app.listen(5000 || process.env.PORT, () => {
    console.log("Connected to backend ");
});