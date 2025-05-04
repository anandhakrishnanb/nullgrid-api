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
},{versionKey: String,


});

const User = mongoose.model('User', userSchema);

// API Routes

// Create new user
app.post('/add_users', async (req, res) => {
  try {
    const { userId, userName, userPhoneNumber } = req.body;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ message: '❌ Username already exists' });
    }

    const newUser = new User({ userId, userName, userPhoneNumber });
    await newUser.save();

    res.status(201).json({
      message: '✅ User added successfully',
      user: newUser
    });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ message: '❌ Error saving user', error: err.message });
  }
});

// Get all users
app.get('/get_users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json({
        message: '✅ Users fetched successfully',
        users
      });
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: '❌ Failed to fetch users', error: err.message });
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});


