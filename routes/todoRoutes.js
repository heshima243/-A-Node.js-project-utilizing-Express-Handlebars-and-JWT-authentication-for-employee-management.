
// Import required modules
const express = require('express');
const todoController = require('../controllers/todoController');
const con = require('../services/db');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const checkAuth = require('../middleware/checkAuth');

// Create a router instance
const routes = express.Router();

// Define routes
routes.get('/', todoController.getHome); // Home route

routes.get('/publish', todoController.getPublish); // Publish route

routes.post('/', todoController.postPublish); // Post route for inserting data

routes.get('/list', checkAuth.checkAuth, todoController.getList); // List route with authentication check

routes.get('/updateList/:id', checkAuth.checkAuth, todoController.getUpdateList); // Update route with authentication check

routes.post('/update/:id', todoController.postUpdate); // Post route for updating data

routes.get('/delete/:id', todoController.getDelete); // Delete route

routes.get('/signup', todoController.getSignup); // Signup route
routes.post('/signup', todoController.postSignup); // Post route for user signup

routes.get('/login', todoController.getLogin); // Login route
routes.post('/login', todoController.postLogin); // Post route for user login

routes.get('/logout', todoController.logout); // Logout route

module.exports = routes;

