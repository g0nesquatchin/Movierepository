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

// Add new movie
app.post('/api/movies', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await db.query(
      'INSERT INTO movies (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete movie
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM movies WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add toggle watched status endpoint
app.put('/api/movies/:id/toggle-watched', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'UPDATE movies SET watched = NOT watched WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error toggling watched status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 