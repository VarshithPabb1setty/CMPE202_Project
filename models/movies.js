const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
  // movieId: { 
  //   type: String
  // },
  title: {
    type: String
  },
  cast: {
    type: Array
  },
  crew: { 
    type: Array 
  },
  description: { 
    type: String 
  },
  format: {
    type:String
  },
  genres: { 
    type: Array 
  },
  languages: {
    type:Array
  },
  runTime:{
    type: Number
  },
  rating: { 
    type: Number 
  },
  movieTrailerUrl: {
    type: String
  },
  releaseDate:{
    type: Date
  },
  ticketPrice: {
    type: Number
  },
  ticketsSold: {
    type: Number
  },
  posterUrl: { 
    type: String 
  },
  certificate: {
    type: String
  },
  popularity: {
    type: Number
  },
  isActive: {
    type: Boolean
  },
}, {
  timestamps: true,
});


const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;
