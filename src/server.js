const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password', 
  database: 'task_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  pool.query(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, hashedPassword],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, email });
    }
  );
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  pool.query(
    'SELECT * FROM users WHERE email = ?', 
    [email], 
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
  
    const user = results[0];
      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({ message: 'Login successful' });
      } 
      else {
        res.status(400).json({ error: 'Invalid email or password' });
      }
    }
  );
});

app.get('/api/tasks', (req, res) => {
  const userId = req.user.id;

  pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
    return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id; 

  pool.query(
    'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
    [title, description, status, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, title, description, status });
    }
  );
});

app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status } = req.body;
  const { id } = req.params;

  pool.query(
    'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
    [title, description, status, id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Task updated' });
    }
  );
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM tasks WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Task deleted' });
  });
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});
