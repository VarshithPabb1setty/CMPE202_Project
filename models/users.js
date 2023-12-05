const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  // userId : {
  //   type: String,
  // },
  firstName: 
  { 
    type: String
  },
  lastName: {
    type: String
  },
  fullName: { 
    type: String
  },
  dob: {
    type: Date
  },
  gender: {
    type: String,
  },
  mobile: {
    type: String,
  },
  genres: {
    type: Array
  },
  favouriteArtists: {
    type:Array
  },
  role: {
    type: String,
    enum: ['member', 'non-member', 'admin'],
    required: true
  },
  memberShipType: {
    type: String,
    enum: ['regular', 'premium'],
    'default': 'regular'
  },
  rewardPoints: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean
  },
  isPrime: {
    type: Boolean
  },
  email: { 
    type: String,
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    required: true }
}, {
  timestamps: true,
});


const User = mongoose.model('User', userSchema);

module.exports = User;
