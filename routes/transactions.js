// routes/transactions.js
const express = require('express');
const db = require('../database');
const router = express.Router();

// Add a new transaction
router.post('/', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `INSERT INTO transactions (type, category, amount, date, description) 
                 VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [type, category, amount, date, description], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, message: 'Transaction added.' });
  });
});

// Get all transactions
router.get('/', (req, res) => {
  const query = 'SELECT * FROM transactions';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get a transaction by ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM transactions WHERE id = ?';
  db.get(query, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ message: 'Transaction not found' });
    res.json(row);
  });
});

// Update a transaction by ID
router.put('/:id', (req, res) => {
  const { type, category, amount, date, description } = req.body;
  const query = `UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? 
                 WHERE id = ?`;

  db.run(query, [type, category, amount, date, description, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction updated successfully' });
  });
});

// Delete a transaction by ID
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM transactions WHERE id = ?';
  db.run(query, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// Get summary of transactions
router.get('/summary', (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
      (SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - 
       SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)) AS balance
    FROM transactions
  `;

  db.get(query, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

module.exports = router;
