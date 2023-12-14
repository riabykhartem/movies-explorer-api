const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotAuthoirizedError = require('../errors/NotAuthoirizedError');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { NODE_ENV, JWT_SECRET } = process.env;
const JWT = require('jsonwebtoken');

const getCurrentUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(new NotFoundError('User not found'));
      }
      return res.status(200).send(user);
    } catch (err) {
      return next(err);
    }
  };

const updateProfile = async (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(
    req.user._id, 
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
}

const createUser = (req, res, next) => {
  const {
    email, password, name
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name
    }))
    .then((user) => res.status(201).send({
      name: user.name, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(err.message));
      } if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new NotAuthoirizedError('Неправильные почта или пароль'));
  }

  const matched = await bcrypt.compare(password, user.password);
  if (!matched) {
    return next(new NotAuthoirizedError('Неправильные почта или пароль'));
  }

  const payload = { _id: user._id };

  const token = JWT.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'cheburashka', { expiresIn: '7d' });
  return res.status(200).send({ token });
};
  
  module.exports = {
    getCurrentUser,
    updateProfile,
    createUser,
    login
  };
  