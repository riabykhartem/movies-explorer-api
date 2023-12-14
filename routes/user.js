const router = require('express').Router();
const { getCurrentUser, updateProfile, createUser, login } = require('../controllers/user');
const { EMAIL_REGEX } = require('../utils/constants');
const authorization = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');

router.get('/users/me', authorization, getCurrentUser);

router.patch('/users/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().pattern(EMAIL_REGEX),
    }),
  }), authorization, updateProfile);

router.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().pattern(EMAIL_REGEX),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }), createUser);

router.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().pattern(EMAIL_REGEX),
      password: Joi.string().required(),
    }),
  }), login);
module.exports = router;
