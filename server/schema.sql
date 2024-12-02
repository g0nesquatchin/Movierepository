CREATE DATABASE movielist;

\c movielist;

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

-- Insert initial data
INSERT INTO movies (title) VALUES
  ('Mean Girls'),
  ('Hackers'),
  ('The Grey'),
  ('Sunshine'),
  ('Ex Machina');