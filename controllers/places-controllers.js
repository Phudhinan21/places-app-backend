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
