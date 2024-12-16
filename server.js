const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/minibar', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Models
const Item = mongoose.model('Item', new mongoose.Schema({
    name: String,
    price: Number,
    currency: String,
}));

const Invoice = mongoose.model('Invoice', new mongoose.Schema({
    details: Array,
    total: String,
    date: String,
}));

// Routes
app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
});

app.post('/invoices', async (req, res) => {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.status(201).json(newInvoice);
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));