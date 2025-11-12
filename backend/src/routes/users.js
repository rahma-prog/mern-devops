const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Create user
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  res.status(201).json(user);
});

// Get user by ID
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Get all
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.put('/:id', async (req, res) => {
  const { name, email, role, password } = req.body;
  const updates = { name, email, role };
  if (password) updates.password = await bcrypt.hash(password, 10);
  const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!updated) return res.status(404).json({ message: 'User not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted successfully' });
});


module.exports = router;
