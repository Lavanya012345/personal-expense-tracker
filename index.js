const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Personal Expense Tracker API');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
