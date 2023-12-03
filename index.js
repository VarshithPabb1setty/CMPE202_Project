const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('./db');
const UserRoute = require('./routes/users')
const TheatreRoute = require('./routes/theatres')
const ShowTimesRoute = require('./routes/showTimes')
const MovieRoute = require('./routes/movies')
const ScreenRoute = require('./routes/screens')
const ArtistRoute = require('./routes/artists')
const PaymentsRouter = require('./routes/payments');
const TicketsRouter = require('./routes/tickets')
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const multer = require ('multer');
// const path = require('path');
const port = 8080
const corsOptions = {
  origin: '*',
  // credentials: true,
};

// // Configure multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, 'uploads/') // 'uploads/' is the folder where files will be saved
//   },
//   filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// });

// module.exports.upload = multer({ storage: storage });

app.use(express.json());
app.use(cors(corsOptions));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_SECRET_KEY,
    // You can use the default in-memory store or choose another session store here
  }));

app.use('/artist', ArtistRoute)
app.use('/theatres', TheatreRoute)
app.use('/screens', ScreenRoute)
app.use('/showTimes', ShowTimesRoute)
app.use('/movies', MovieRoute)
app.use('/user', UserRoute)
app.use('/payments', PaymentsRouter);
app.use('/tickets', TicketsRouter);
app.get('/home', (req, res) => {
  res.json({ message: 'Hello World!' })
})

app.listen(port, () => {
  console.log(`Server started on PORT : ${port}`)
})