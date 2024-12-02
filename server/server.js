const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Test database connection
app.get ('/', (req, res) => {
  res.json({message: 'Hello World'});
})

// GET all movies
app.get('/api/movies', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM movies');
    console.log('Movies fetched:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 