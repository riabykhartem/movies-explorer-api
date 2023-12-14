const { NODE_ENV, JWT_SECRET } = process.env;

const JWT = require('jsonwebtoken');
const NotAuthoirizedError = require('../errors/NotAuthoirizedError');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      next(new NotAuthoirizedError('Необходима авторизация'));
    }
  
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = JWT.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'cheburashka');
    } catch (err) {
      next(new NotAuthoirizedError('Необходима авторизация'));
    }
    req.user = payload; 
  
    next();
};