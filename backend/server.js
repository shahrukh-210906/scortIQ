// backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));

// Change this line to use the new filename
app.use('/api/profile', require('./routes/userProfile'));

app.use('/api/teacher', require('./routes/teacher'));

app.use('/api/classrooms', require('./routes/classrooms'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));