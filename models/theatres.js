const mongoose = require('mongoose');


const theaterSchema = new mongoose.Schema({
  theatreId: { 
    type: String 
  },
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
  theatreUrl: { 
    type: String 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});


const Theater = mongoose.model('theater', theaterSchema);

module.exports = Theater;
