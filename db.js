const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI; 
console.log('MONGODB_URI', MONGODB_URI)

mongoose.connect(MONGODB_URI, { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to Mongo!!!"))
.catch((err) => console.log(err));


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


module.exports = mongoose;
