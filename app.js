// Import required modules
const express = require('express');
const con = require('./services/db');
const { engine } = require('express-handlebars');
const todoRoutes = require('./routes/todoRoutes');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Set the port number
const PORT = 6000;

// Create an instance of the express application
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// Set the handlebars as the view engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Use the todoRoutes for handling routes
app.use('/', todoRoutes);

// Start the server
app.listen(PORT, console.log(`START ON ${PORT}`));
