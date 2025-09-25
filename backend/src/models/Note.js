const mongoose = require('mongoose');
const NoteSchema = new mongoose.Schema({
title: { type: String },
content: { type: String },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
embedding: { type: [Number], default: [] }
}, { timestamps: true });


// create text index for keyword search
NoteSchema.index({ title: 'text', content: 'text' });


module.exports = mongoose.model('Note', NoteSchema);