const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

router.use(auth);

// Create note
router.post('/', async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = new Note({ title, content, owner: req.user._id });
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Could not create note' });
  }
});

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ owner: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch notes' });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch note' });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ message: 'Not found' });
    note.title = title;
    note.content = content;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Could not update note' });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id, owner: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete note' });
  }
});

module.exports = router;
