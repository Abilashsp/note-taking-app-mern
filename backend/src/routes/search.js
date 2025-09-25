// routes/search.js
const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/auth');
const { getEmbeddingForText } = require('../utils/embeddings');

const router = express.Router();
router.use(auth);

// GET /api/search?query=...&mode=keyword|semantic&limit=10
router.get('/', async (req, res) => {
  const { query = '', mode = 'keyword', limit = 10 } = req.query;
  console.log('Search query:', { query, mode, limit });

  try {
    if (!query) return res.json([]);

    if (mode === 'keyword') {
      // text index search
      const results = await Note.find(
        { $text: { $search: query }, owner: req.user._id },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(parseInt(limit));

      return res.json(results);
    }

    // semantic search
    const qEmbedding = await getEmbeddingForText(query);
    if (!qEmbedding) return res.status(500).json({ message: 'Embedding failed' });

    // efficient: fetch only notes with embeddings
    const candidates = await Note.find({
      owner: req.user._id,
      embedding: { $exists: true, $ne: [] },
    }).select('title content embedding'); // only required fields

    // compute cosine similarity
    const sims = candidates.map(n => {
      const dot = dotProduct(n.embedding, qEmbedding);
      const sim = dot / (norm(n.embedding) * norm(qEmbedding) + 1e-10);
      return { note: n, score: sim };
    });

    sims.sort((a, b) => b.score - a.score);
    const top = sims.slice(0, parseInt(limit)).map(s => ({ ...s.note.toObject(), score: s.score }));
    res.json(top);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Search error' });
  }
});

function dotProduct(a, b) { return a.reduce((sum, ai, i) => sum + ai * b[i], 0); }
function norm(a) { return Math.sqrt(a.reduce((s, v) => s + v * v, 0)); }

module.exports = router;
