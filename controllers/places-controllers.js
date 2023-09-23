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

    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (error) {
    return next(error);
  }
};

exports.getPlaceByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("There is no user.");
      error.code = 400;
      throw error;
    }

    const places = await Place.find({ creator: userId });

    res.status(200).json({
      places: places.map((place) => {
        return place.toObject({ getters: true });
      }),
    });
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
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      const error = new Error("There is no user.");
      error.code = 401;
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
      place: newPlace.toObject({ getters: true }),
      user: user.toObject({ getters: true }),
    });
  } catch (error) {
    return next(error);
  }
};

exports.updatePlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Invalid input");
      error.code = 422;
      throw error;
    }
  } catch (error) {
    return next(error);
  }

  const { placeId } = req.params;
  const { title, description } = req.body;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("There is no user.");
      error.code = 401;
      throw error;
    }

    const place = await Place.findById(placeId);

    if (!place) {
      const error = new Error("There is no place.");
      error.code = 422;
      throw error;
    }

    if (req.userId !== place.creator.toString()) {
      const error = new Error("You are not allowed to delete this place.");
      error.code = 401;
      throw error;
    }

    place.title = title;
    place.description = description;

    await place.save();

    res
      .status(200)
      .json({
        message: "Updated place successfully",
        place: place.toObject({ getters: true }),
      });
  } catch (error) {
    return next(error);
  }
};

exports.deletePlace = async (req, res, next) => {
  const { placeId } = req.params;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("There is no user.");
      error.code = 401;
      throw error;
    }

    const place = await Place.findById(placeId);

    if (!place) {
      const error = new Error("There is no place.");
      error.code = 422;
      throw error;
    }

    if (req.userId !== place.creator.toString()) {
      const error = new Error("You are not allowed to delete this place.");
      error.code = 401;
      throw error;
    }

    await Place.findByIdAndDelete(placeId);
    user.places.pull(placeId);
    await user.save();

    res.status(200).json({ message: "Deleted place successfully." });
  } catch (error) {
    return next(error);
  }
};
