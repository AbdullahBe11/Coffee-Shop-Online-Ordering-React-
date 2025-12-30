const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// SERVE IMAGES STATICALLY (Crucial for your frontend to see images)
// __dirname works automatically here because we removed "type": "module"
app.use("/images", express.static(path.join(__dirname, "images")));

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "coffeeshop", 
});

// Multer Storage for Image Uploads
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. GET ALL MENU ITEMS
app.get("/menu", (req, res) => {
    const q = "SELECT * FROM menu";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// 2. GET SINGLE ITEM
app.get('/search/:id', (req, res) => {
    const id = req.params.id;
    const q = "SELECT * FROM menu WHERE id = ?";
    db.query(q, [id], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// 3. CREATE ITEM (Admin)
app.post("/create", upload.single('image'), (req, res) => {
    const q = "INSERT INTO menu(`name`, `price`, `image`) VALUES (?,?,?)";
    // Check if a file was actually uploaded
    const imageFilename = req.file ? req.file.filename : ""; 

    db.query(q, [req.body.name, req.body.price, imageFilename], (err, data) => {
        if (err) return res.send(err);
        return res.json("Item created successfully");
    });
});

// 4. DELETE ITEM (Fixed Logic)
app.delete("/menu/:id", (req, res) => {
    const id = req.params.id;

    // First: Find the image name so we can delete the file
    const qGetImage = "SELECT image FROM menu WHERE id = ?";
    db.query(qGetImage, [id], (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("Item not found");

        const imageFileName = data[0].image;

        // Second: Delete from Database
        const qDelete = "DELETE FROM menu WHERE id = ?";
        db.query(qDelete, [id], (err2, data2) => {
            if (err2) return res.status(500).json(err2);

            // Third: Delete the actual file from the folder
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

// 5. UPDATE ITEM (Admin)
app.post("/modify/:id", upload.single('image'), (req, res) => {
    const id = req.params.id;
    const { name, price } = req.body;
    
    let q = "";
    let values = [];

    if (req.file) {
        // If they uploaded a new image, update everything
        q = "UPDATE menu SET `name`= ?, `price`= ?, `image` = ? WHERE id = ?";
        values = [name, price, req.file.filename, id];
    } else {
        // If they didn't upload an image, keep the old one
        q = "UPDATE menu SET `name`= ?, `price`= ? WHERE id = ?";
        values = [name, price, id];
    }

    db.query(q, values, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

// 6. PLACE ORDER (New Route)
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
    console.log("Connected to backend on port 5000");
});