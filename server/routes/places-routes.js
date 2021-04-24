const express = require("express");
const { body } = require("express-validator");
const placeControllers = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get("/:pid", placeControllers.getPlaceById);

router.get("/users/:uid", placeControllers.getPlacesbyUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single('image'),
  [
    body("title").not().isEmpty(),
    body("description").isLength({ min: 5 }),
    body("address").not().isEmpty(),
  ],
  placeControllers.createPlace
);

router.patch(
  "/:pid",
  [
    body("title").not().isEmpty(),
    body("description").isLength({ min: 5 }),
  ],
  placeControllers.updatePlace
);

router.delete("/:pid", placeControllers.deletePlace);

module.exports = router;
