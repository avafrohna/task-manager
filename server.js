const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: true,
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalid' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed: ' + err.message });
    }
    if (results && results.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      pool.query(
        'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
        [firstname, lastname, email, hashedPassword],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          console.log('User registered successfully:', email);
          res.status(201).json({ id: results.insertId, firstname, lastname, email });
        }
      );
    } 
    catch (error) {
      res.status(500).json({ error: 'Error registering user: ' + error.message });
    }
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  pool.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
  
    const user = results[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } 
    else {
      res.status(400).json({ error: 'Invalid email or password' });
    }
  });
});

app.get('/api/user', authenticateToken, (req, res) => {
  const userId = req.user.id;

  pool.query('SELECT firstname, lastname, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});

app.get('/api/tasks/progress', authenticateToken, (req, res) => {
  const userId = req.user.id;

  pool.query(
    'SELECT COUNT(*) AS total, SUM(CASE WHEN status = "Finished" THEN 1 ELSE 0 END) AS completed FROM tasks WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const { total, completed } = results[0];
      res.json({ total, completed });
    }
  );
});

app.get('/api/tasks', authenticateToken, (req, res) => {
  const userId = req.user.id;

  pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.get('/api/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  pool.query(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ?', 
    [id, userId], 
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(results[0]);
    }
  );
});

app.post('/api/tasks', authenticateToken, (req, res) => {
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
