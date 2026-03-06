const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();


// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || "https://unicx.in,http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});


// File upload middleware (Applied only once here)
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // Increased to 50MB for potential large images/content
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  debug: false
}));

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const sectionsDir = path.join(uploadsDir, 'sections');
const caseStudiesDir = path.join(uploadsDir, 'case_studies');
const blogsDir = path.join(uploadsDir, 'blogs');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir, { recursive: true });
  console.log('Created sections directory');
}

if (!fs.existsSync(caseStudiesDir)) { // Ensure this directory exists
  fs.mkdirSync(caseStudiesDir, { recursive: true });
  console.log('Created case_studies directory');
}

if (!fs.existsSync(blogsDir)) {
  fs.mkdirSync(blogsDir, { recursive: true });
  console.log('Created blogs directory');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Test route for server health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const db = require("../server/database"); // Assuming '../server/database' correctly initializes your DB connection
require('../server/db')(app, db); // This is where db.js routes are mounted

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
