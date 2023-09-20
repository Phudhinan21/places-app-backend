const express = require("express");
const router = express.Router();

const placesControllers = require("../../controllers/places-controllers");
const auth = require("../../middleware/auth");

router.get("/:placeId", placesControllers.getPlaceById);

router.post("/create-place", auth, placesControllers.createPlace);

module.exports = router;
