require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const emailController = require('./controllers/classifyEmail');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error(err);
});

const app = express();

app.set('view engine', 'ejs');

app.get('/emails', emailController.getEmailsController);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
