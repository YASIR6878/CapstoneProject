const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/books', bookRoutes);
app.use('/members', memberRoutes);
app.use('/transactions', transactionRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/libraryDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
