const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',                // Your MySQL user
  password: 'DAR@shan146777',   // Your MySQL password
  database: 'student_management'
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Get all students
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add new student
app.post('/students', (req, res) => {
  const data = req.body;
  const sql = 'INSERT INTO students (name, age, roll_number, class, subjects, marks) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [
      data.name,
      data.age,
      data.roll_number,
      data.class,
      JSON.stringify(data.subjects),
      JSON.stringify(data.marks)
    ],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Student added', id: result.insertId });
    }
  );
});

// Update student
app.put('/students/:id', (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const sql = 'UPDATE students SET name=?, age=?, roll_number=?, class=?, subjects=?, marks=? WHERE id=?';
  db.query(
    sql,
    [
      data.name,
      data.age,
      data.roll_number,
      data.class,
      JSON.stringify(data.subjects),
      JSON.stringify(data.marks),
      id
    ],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Student updated' });
    }
  );
});

// Delete student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id=?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Student deleted' });
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
