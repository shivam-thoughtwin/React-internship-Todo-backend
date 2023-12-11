const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const port = 5002;

const dbConfig = require('../config/secret');
const todo = require('../routes/todoRoutes');
const auth = require('../routes/authRoutes');
const user = require('../routes/userRourtes');

app.use(express.json());

mongoose.connect(dbConfig.url, { useNewUrlParser: true });

app.use(
  cors({
    origin: '*',
  })
);

app.use('/api/todo', todo);
app.use('/api/todo', auth);
app.use('/api/todo', user);

app.listen(port, () => {
  console.log(`Connection is setup at ${port}`);
});
