const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
    // paymentId: 
    // { 
    //     type: String, 
    //     required: true 
    // },
    transactionId: { 
        type: String, 
        required: true 
    },
    cardDetails: { 
        type: mongoose.Schema.Types.Mixed, 
        default: {} 
    },
    address: {
        type: String,
    },
    status: { 
        type: String, 
        required: true 
    },
    userId: { 
        type: String, 
        required: true 
    },
    modeOfPayment: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});


const PaymentModel = mongoose.model('payments', paymentSchema);

module.exports = PaymentModel;