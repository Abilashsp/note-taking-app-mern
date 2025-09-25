require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const searchRoutes = require('./routes/search');


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/search', searchRoutes);


const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
app.listen(PORT, () => console.log('Server listening on', PORT));
})
.catch(err => console.error('MongoDB connect error', err));