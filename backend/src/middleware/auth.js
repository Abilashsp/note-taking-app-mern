const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;


module.exports = async function (req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'Missing token' });
const token = authHeader.split(' ')[1];
try {
const payload = jwt.verify(token, JWT_SECRET);
req.user = await User.findById(payload.userId).select('-passwordHash');
next();
} catch (err) {
res.status(401).json({ message: 'Invalid token' });
}
};