const router = require('express').Router();
const { createMovie, getMovies, deleteMovie } = require('../controllers/movie');
const authorization = require('../middlewares/auth');

router.post('/movies',authorization, createMovie);

router.get('/movies',authorization, getMovies);

router.delete('/movies/:movieId',authorization, deleteMovie);

module.exports = router;

