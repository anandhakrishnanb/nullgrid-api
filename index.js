const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userPhoneNumber: String,
});

const User = mongoose.model('User', userSchema);

// API Routes

// Create new user
app.post('/add_users', async (req, res) => {
  try {
    const { userId, userName, userPhoneNumber } = req.body;
    const newUser = new User({ userId, userName, userPhoneNumber });
    await newUser.save();
    res.status(201).send('User added');
  } catch (err) {
    res.status(500).send('Error saving user');
  }
});

// Get all users
app.get('/get_users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});


