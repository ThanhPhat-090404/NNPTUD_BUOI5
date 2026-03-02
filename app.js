require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

// Route imports
const roleRoutes = require('./src/routes/role.routes');
const userRoutes = require('./src/routes/user.routes');

// Middleware imports
const errorHandler = require('./src/middlewares/errorHandler');

// Init app
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static UI resources
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
