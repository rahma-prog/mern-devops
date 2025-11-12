require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('express-async-errors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/rentals', require('./routes/rentals'));


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

console.log('Starting server...');
console.log('Mongo URI:', process.env.MONGO_URI ? 'Loaded ✅' : 'Missing ❌');

connectDB(process.env.MONGO_URI).then(() => {
  console.log('Starting Express server...');
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
