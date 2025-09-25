const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


router.post('/register', async (req, res) => {
const { name, email, password } = req.body;
try {
const existing = await User.findOne({ email });
if (existing) return res.status(400).json({ message: 'Email in use' });
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);
const user = await User.create({ name, email, passwordHash });
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
});


router.post('/login', async (req, res) => {
const { email, password } = req.body;
try {
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Invalid credentials' });
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
} catch (err) {
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;