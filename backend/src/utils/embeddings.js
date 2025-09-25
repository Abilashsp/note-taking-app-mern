const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

let ai;
if (GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

async function getEmbeddingForText(text) {
  console.log('Getting embedding for text:', text);
  if (!ai) {
    console.error('GEMINI_API_KEY not set.');
    return null;
  }

  try {
    const response = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: [text], // must be an array
    });

    // ✅ Correct path for Gemini API
    const embedding = response?.embeddings?.[0]?.values;
     console.log('Embedding response:', embedding.toString());
    if (!embedding) {
      console.error('No embedding returned from Gemini API', response);
      return null;
    }

    return embedding;

  } catch (err) {
    console.error('Embedding error with Gemini API:', err.response?.data || err.message);
    return null;
  }
}

function dotProduct(a, b) {
  return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
}

function norm(a) {
  return Math.sqrt(a.reduce((s, v) => s + v*v, 0));
}

module.exports = { getEmbeddingForText, dotProduct, norm };
