const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const customers = await Customer.find().sort("name");
    res.send(customers);
  } catch (ex) {
    next(ex);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    });
    customer = await customer.save();

    res.send(customer);
  } catch (ex) {
    next(ex);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
      },
      { new: true }
    );

    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
  } catch (ex) {
    next(ex);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
  } catch (ex) {
    next(ex);
  }
  const customer = await Customer.findByIdAndRemove(req.params.id);
});

router.get("/:id", auth, async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found.");

    res.send(customer);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
