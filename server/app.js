const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/https-error');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});

app.use('/api/places',placesRoutes); // => /api/places/...
app.use('/api/users',usersRoutes); // => /api/users/...

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((err, req, res, next) => {
  if(req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    })
  }
  if(res.headerSent){
    return next(err);
  }
  res.status(err.code || 500);
  res.json({message: err.message || "An unknown error occured"});
});

mongoose
  .connect('mongodb+srv://admin-Ekjot-Kaur:Bolesonihal123@places.axl2f.mongodb.net/mern?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    app.listen(5000, () => {
      console.log("Server Running on PORT 5000");
    });
  })
  .catch( err => {
    console.log(err);
  });

  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);