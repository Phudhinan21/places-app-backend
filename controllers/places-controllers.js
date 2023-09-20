const Place = require("../models/place");
const User = require("../models/user");

exports.getPlaceById = async (req, res, next) => {
  res.status(200).json({ message: "place" });
};

exports.createPlace = async (req, res, next) => {
  const { title, description, address } = req.body;

  try {
    const newPlace = new Place({
      title,
      description,
      address,
      creator: req.userId,
    });

    await newPlace.save();

    res
      .status(200)
      .json({ message: "Created place successfully", place: newPlace });
  } catch (error) {
    return next(error);
  }
};
