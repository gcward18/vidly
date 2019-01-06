const auth = require("../middleware/auth");
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const movies = await Movie.find().sort("name");
    res.send(movies);
  } catch (ex) {
    next(ex);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    let movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    });
    movie = await movie.save();

    res.send(movie);
  } catch (ex) {
    next(ex);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    next(ex);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    next(ex);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie)
      return res.status(404).send("The movie with the given ID was not found.");

    res.send(movie);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
