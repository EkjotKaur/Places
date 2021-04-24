const fs = require('fs');
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/https-error");
const Place = require("../models/places");
const User = require("../models/users");

/////////////////////////////////////////////////////////////////////////
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. could not find a place. ",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) }); // => {place} => {place: place};
};

////////////////////////////////////////////////////////////
const getPlacesbyUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creatorId: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any place."
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  }); // => {place} => {place: place};
};

///////////////////////////////////////////////////////////////
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Inavalid inputs passes, please check your data.", 422)
    );
  }

  const { title, description, address, creatorId } = req.body;
  const createdPlace = new Place({
    title,
    description,
    address,
    image: req.file.path,
    creatorId,
  });

  let user;
  try {
    user = await User.findById(creatorId);
  } catch {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  // console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

///////////////////////////////////////////////////////
const updatePlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    throw new HttpError(
      "Inavalid inputs passes,, please check your data.",
      422
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. could not find a place. ",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find any place.",
      500
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

////////////////////////////////////////////////////////
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creatorId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place. ",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("Could not find place for this id", 404));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creatorId.places.pull(place);
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place. ",
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: "Deleted Place!" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesbyUserId = getPlacesbyUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
