const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const usersControllers = require("../../controllers/users-controllers");

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

module.exports = router;
