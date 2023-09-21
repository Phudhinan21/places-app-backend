const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const placesControllers = require("../../controllers/places-controllers");
const auth = require("../../middleware/auth");

router.get("/:placeId", placesControllers.getPlaceById);

router.get("/user/:userId", placesControllers.getPlaceByUserId);

router.post(
  "/create-place",
  auth,
  [
    check("title").notEmpty(),
    check("description").notEmpty(),
    check("address").notEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:placeId",
  auth,
  [check("title").notEmpty(), check("description").notEmpty()],
  placesControllers.updatePlace
);

router.delete("/delete-place/:placeId", auth, placesControllers.deletePlace);

module.exports = router;
