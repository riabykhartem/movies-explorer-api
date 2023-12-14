const router = require('express').Router();
const userRoutes = require('./user');
const movieRoutes = require('./movies');
const NotFoundError = require('../errors/NotFoundError');


router.use('/', userRoutes);
router.use('/', movieRoutes);
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.use('*', (req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = router;


