const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRoutes = require('./routers/user'); 
const bookRoutes = require('./routers/book'); 
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.DBLINK, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoutes); 
app.use('/api/auth', userRoutes); 

module.exports = app;
