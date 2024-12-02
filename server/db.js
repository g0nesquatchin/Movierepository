const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'movielist',
  
  port: 5432,
});


// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connection successful!');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
}; 