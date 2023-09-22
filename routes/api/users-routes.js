const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const usersControllers = require("../../controllers/users-controllers");
const auth = require("../../middleware/auth");

router.get("/", usersControllers.getAllUsers);

router.get("/auth", auth, usersControllers.getUser);

router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);

router.post("/login", usersControllers.login);

module.exports = router;
