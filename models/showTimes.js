const mongoose = require('mongoose');

const showTimeSchema = new mongoose.Schema({
    // showTimeId: {
    //     type: String,
    // },
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    startTime: { 
        type: Date,
    },
    endTime: { 
        type: Date,
    },
    price: { 
        type: Number
    },
    discountPrice: { 
        type: Number,
    },
    seatsBooked: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


const ShowTime = mongoose.model('showTimes', showTimeSchema);


module.exports = ShowTime;