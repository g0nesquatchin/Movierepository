import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'watched', or 'toWatch'

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/movies');
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMovie = async (e) => {
    e.preventDefault();
    if (!newMovieTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:3001/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newMovieTitle }),
      });

      if (!response.ok) throw new Error('Failed to add movie');
      
      const newMovie = await response.json();
      setMovies([...movies, newMovie]);
      setNewMovieTitle('');
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/movies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete movie');
      
      setMovies(movies.filter(movie => movie.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleWatched = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/movies/${id}/toggle-watched`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to update movie status');
      
      const updatedMovie = await response.json();
      setMovies(movies.map(movie => 
        movie.id === id ? updatedMovie : movie
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const getFilteredMovies = () => {
    let filtered = movies;
    
    // First apply search filter
    filtered = filtered.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Then apply watched/unwatched filter
    switch (filter) {
      case 'watched':
        return filtered.filter(movie => movie.watched);
      case 'toWatch':
        return filtered.filter(movie => !movie.watched);
      default:
        return filtered;
    }
  };

  return (
    <div className="App">
      <h1>Movie List</h1>
      
      {/* Add Movie Form */}
      <form onSubmit={addMovie} className="add-movie-form">
        <input
          type="text"
          placeholder="Enter new movie title..."
          value={newMovieTitle}
          onChange={(e) => setNewMovieTitle(e.target.value)}
          className="add-movie-input"
        />
        <button type="submit" className="add-movie-button">Add Movie</button>
      </form>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Movies
        </button>
        <button 
          className={`filter-button ${filter === 'watched' ? 'active' : ''}`}
          onClick={() => setFilter('watched')}
        >
          Watched
        </button>
        <button 
          className={`filter-button ${filter === 'toWatch' ? 'active' : ''}`}
          onClick={() => setFilter('toWatch')}
        >
          To Watch
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Error and Loading States */}
      {loading && <div>Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      
      {/* Movie List */}
      <div className="movie-list">
        {getFilteredMovies().map((movie) => (
          <div key={movie.id} className="movie-item">
            <span>{movie.title}</span>
            <div className="movie-actions">
              <button 
                onClick={() => toggleWatched(movie.id)}
                className={`watch-button ${movie.watched ? 'watched' : ''}`}
              >
                {movie.watched ? 'Watched' : 'To Watch'}
              </button>
              <button 
                onClick={() => deleteMovie(movie.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;