const mongoose = require('mongoose');


const theatreSchema = new mongoose.Schema({
  // theatreId: {
  //   type: String 
  // },
  theatreName: {
    type: String 
  },
  description: { 
    type: String 
  },
  "location": {
    type: String,
  },
  state: { 
    type: String
  },
  address: { 
    type: String 
  },
  zip: { 
    type: Number 
  },
  contact: { 
    type: Number 
  },
  city: { 
    type: String 
  },
  theatreUrl: { // Poster of the theatre
    type: String 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});


const Theatre = mongoose.model('theatre', theatreSchema);

module.exports = Theatre;
