const jwt = require('jsonwebtoken');

const {secretKey} = require('../config')

const expiresInSeconds = 60;// Durée de validité du token en jours

// Middleware function to check authentication
exports.checkAuth = (req, res, next) => {
  // Get the token from the cookie
  const token = req.cookies.token;

  if (!token) {
    // Redirect to the login page if the token is not present
    return res.redirect('/login');
  }

  // Verify the token
  jwt.verify(token, secretKey,{ expiresIn: `${expiresInSeconds}s` }, (err, decoded) => {
    if (err) {
      // Redirect to the login page if the token is invalid
      return res.redirect('/login');
    }

    // Valid token, proceed to the next middleware or route handler
    req.user = decoded.userId;
    next();
  });
};
