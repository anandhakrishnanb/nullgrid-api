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
    id: String,
    name: String,
    phone_number: String,
  }, { versionKey: false });
  

const User = mongoose.model('User', userSchema);

// API Routes

// Create new user
app.post('/add_users', async (req, res) => {
  try {
    const { id, name, phone_number } = req.body;
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: '❌ Username already exists' });
    }

    const newUser = new User({ id, name, phone_number });
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

// Delete user by name
app.delete('/delete_user/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const deletedUser = await User.findOneAndDelete({ name });

    if (!deletedUser) {
      return res.status(404).json({ message: '❌ User not found' });
    }

    res.status(200).json({
      message: `✅ User '${name}' deleted successfully`,
      deletedUser
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: '❌ Error deleting user', error: err.message });
  }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});


