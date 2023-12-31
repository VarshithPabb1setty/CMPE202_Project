const mongoose = require('mongoose');


const ticketSchema = new mongoose.Schema({
    // id: { 
    //     type: String, 
    //     required: true 
    // },
    userId: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    screenId: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    showTime: {
        type: Date,
        default: Date.now
    },                 // Add showId as well
    seatNos: {
        type: [String],
        required: true
    },
    qrUrls: {
        type: [String], // Change the type to string
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});


const TicketModel = mongoose.model('tickets', ticketSchema);

module.exports = TicketModel;