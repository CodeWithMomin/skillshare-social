const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use('/api/users', require('./routes/userRoutes'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes will go here
// app.use('/api/users', require('./routes/userRoutes'));
// Error handler middleware for Multer errors, etc.
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ error: err.message });
//   }
//   if (err) {
//     return res.status(500).json({ error: err.message });
//   }
//   next();
// });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
