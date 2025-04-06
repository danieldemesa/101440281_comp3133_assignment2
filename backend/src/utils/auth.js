const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1]; 
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

module.exports = { getUserFromToken };

