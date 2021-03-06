const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", userController.getUsers);

router.post(
  "/signup",
  fileUpload.single('image'),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), // Test@gmail.com => test@gmail.com -> normalizeEmail();
    check("password").isStrongPassword({
      minlength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  ],
  userController.signup
);

router.post("/login", userController.login);

module.exports = router;
