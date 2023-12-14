const mongoose = require('mongoose');
const movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const createMovie = async (req, res, next) => {
    try {
        const {
            country,director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN} = req.body;
        const newMovie = await movie.create({
            country,director, duration, year, description, image, trailerLink, thumbnail, owner: req.user._id, movieId, nameRU, nameEN
        });
        return res.status(200).send(newMovie);
    } catch (err) {
        return next(err);
    }
}

const getMovies = async (req, res, next) => {
    try {
        const movies = await movie.find({ owner: req.user._id});
        return res.status(200).send(movies);
    } catch (err) {
        return next(err);
    }
};

const deleteMovie = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const movieToDelete = await movie.findById(movieId);
        if (!movieToDelete) {
          return next(new NotFoundError(`Фильм с _id: ${req.params.cardId} не найден.`));
        }
        if (movieToDelete.owner.toString() !== req.user._id) {
            return res.status(403).send({ message: 'Нельзя удалять чужие фильмы' });
        }
        await movieToDelete.deleteOne();
        return res.status(200).send({ message: 'Фильм удалён' });
    } catch (err) {
      if (err instanceof mongoose.Error.CastError) {
            return next(new BadRequestError(`Некорректный _id фильма: ${req.params.cardId}`));
          }
          return next(err);
        }
}

module.exports = { createMovie, getMovies, deleteMovie };