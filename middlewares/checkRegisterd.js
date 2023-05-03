const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const db = require('../models');
const User = db.user;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  
    // Check if token has expired
    if (decodedToken.exp < Date.now() / 1000) {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    }
  console.log(decodedToken)
    // Set the user ID in the request object
    req.user = { user_id: decodedToken.id };


    console.log(req.user)
    next();
  });
}

module.exports = { authenticateToken };
