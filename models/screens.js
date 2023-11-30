const mongoose = require('mongoose');

const status = {
    AVAILABLE: 0,
    BOOKED: 1,
    BLOCKED: 2,
}

const screenSchema = new mongoose.Schema({
    screenId: {
        type: String,
    },
    screenType: { 
        type: String, 
        required: true 
    },
    seatingCapacity: { 
        type: Number, 
        required: true 
    },
    screenName: { 
        type: String, 
        required: true 
    },
    rows: { 
        type: Number, 
        required: true 
    },
    columns: { 
        type: Number, 
        required: true 
    },
    movieId: {
        type: String,
    },
    showTimes: { 
        type: [String], 
        required: true 
    },
    cost: { 
        type: Number 
    },
    theatreId: {
        type: String,
        required: true,
    },
    seatArray: { 
        type: [], 
        required: true 
    },
    occupancyStatus: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


const Screen = mongoose.model('Screens', screenSchema);


module.exports = {
    status,
    Screen,
};