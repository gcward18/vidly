const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    next(ex);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    res.status(401); // client does not have authentication
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true
      }
    );

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

router.delete("/:id", [auth, admin], async (req, res, next) => {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
