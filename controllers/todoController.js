
// Import required modules
const con = require('../services/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const checkAuth = require('../middleware/checkAuth');
const session = require('express-session');

// Import configuration
const { secretKey } = require('../config');

// Render the login view
exports.getHome = (req, res) => {
  res.render('login', {
    viewtitle: 'LOGIN'
  });
};

// Render the publish view
exports.getPublish = (req, res) => {
  res.render('publish', {
    viewtitle: 'CREATE EMPLOYEE'
  });
};

// Insert data into the 'demo' table
exports.postPublish = (req, res) => {
  const data = req.body;

  con.query("INSERT INTO demo SET ?", data, (err, list) => {
    if (err) throw err;
    res.redirect('list');
  });
};

// Get the list of employees from the 'demo' table
exports.getList = (req, res) => {
  // Check if the user is authenticated
  if (!req.user) {
    // Redirect to the login page if not authenticated
    return res.redirect('/login');
  }

  // Fetch the list of employees from the 'demo' table
  con.query('SELECT * FROM demo', (err, list) => {
    if (err) throw err;
    res.render('list', { list, viewtitle: "EMPLOY'S LIST" });
  });
};

// Delete an employee from the 'demo' table
exports.getDelete = (req, res) => {
  const id = req.params.id;

  con.query("DELETE FROM demo WHERE id=?", [id], (err) => {
    res.redirect('/list');
  });
};

// Render the updateList view with employee details
exports.getUpdateList = (req, res) => {
  const id = [req.params.id];

  con.query("SELECT * FROM demo WHERE id=?", [id], (err, results) => {
    const employee = results[0];
    res.render('updateList', { employee, viewtitle: "UPDATE EMPLOYEE" });
  });
};

// Update an employee in the 'demo' table
exports.postUpdate = (req, res) => {
  const data = [req.body.name, req.body.email, req.body.phone, req.params.id];

  con.query("UPDATE demo SET name=?, email=?, phone=? WHERE id=?", data, (err, result) => {
    if (err) throw err;
    res.redirect('/list');
  });
};

/*----------------------------------------------AUTHENTICATION WITH JWT--------------------*/

// Render the signup view
exports.getSignup = (req, res) => {
  res.render('signup', { viewtitle: 'SIGNUP' });
};

// Create a new user
exports.postSignup = (req, res) => {
  const { username, password } = req.body;
  const error = 'User already exists';

  // Check if the username is already taken
  con.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return;
    }

    if (results.length > 0) {
      // User already exists, render the signup page with an error message
      res.render('signup', { error, viewtitle: 'signup' });
    } else {
      // Hash the password and insert the new user into the database
      bcrypt.hash(password, 10, (bcryptErr, hashedPassword) => {
        if (bcryptErr) {
          console.error('Error hashing the password:', bcryptErr);
          return;
        }

        // Insert the new user into the database
        con.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (insertErr) => {
          if (insertErr) {
            console.error('Error inserting the user into the database:', insertErr);
            return;
          }

          // User created successfully, redirect to the login page
          res.redirect('/login');
        });
      });
    }
  });
};

// Render the login view
exports.getLogin = (req, res) => {
  res.render('login', { viewtitle: 'LOGIN' });
};

// Authenticate the user and generate a JWT token
exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  const expiresInMinutes = 10; // Token expiration time in minutes
  const error = "Invalid username or password";

  // Check if the user exists in the database
  con.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return;
    }

    if (results.length === 0) {
      // User not found, render the login page with an error message
      res.render('login', { error, viewtitle: 'LOGIN' });
    } else {
      const user = results[0];

      // Compare the password with the hashed password stored in the database
      bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
        if (bcryptErr || !bcryptResult) {
          // Incorrect password, render the login page with an error message
          res.render('login', { error, viewtitle: 'LOGIN' });
        } else {
          // Password is correct, generate a JWT token
          const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: `${expiresInMinutes}m` });

          // Store the token in a cookie
          res.cookie('token', token);

          // Redirect to the home page or any other authenticated route
          res.redirect('/list');
        }
      });
    }
  });
};

// Logout the user by clearing the token cookie
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('./login');
};
