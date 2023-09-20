const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");

exports.getPlaceById = async (req, res, next) => {
  const { placeId } = req.params;

  try {
    const place = await Place.findById(placeId);

    if (!place) {
      const error = new Error("There is no place.");
      error.code = 422;
      throw error;
    }

    res.status(200).json({ place: place });
  } catch (error) {
    return next(error);
  }
};

exports.createPlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid input.");
      error.code = 422;
      throw error;
    }
  } catch (error) {
    return next(error);
  }

  const { title, description, address } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("There is no user.");
      error.code = 422;
      throw error;
    }

    const newPlace = new Place({
      title,
      description,
      address,
      creator: req.userId,
    });

    await newPlace.save();
    user.places.push(newPlace);
    await user.save();

    res.status(201).json({
      message: "Created place successfully",
      place: newPlace,
      user: user,
    });
  } catch (error) {
    return next(error);
  }
};
