const express = require('express');
const router = express.Router();
const { HTTP_STATUS_CODES } = require('../constants')
const Payment = require('../models/payments');

router.post('/', async (req, res) => {
    try {
        const { transactionId, cardDetails, address, status, userId, modeOfPayment } = req.body;

        const newPayment = new Payment({
            transactionId,
            cardDetails,
            address,
            status,
            userId,
            modeOfPayment
        });

        await newPayment.save();
        res.status(201).json({ message: "Payment created successfully", payment: newPayment });
    } catch (error) {
        console.error('Error in creating payment:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:transactionId', async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        const payment = await Payment.findOne({ transactionId: transactionId });

        if (!payment) {
            return res.status(404).send('Payment not found');
        }

        res.json(payment);
    } catch (error) {
        console.error('Error in fetching payment:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:transactionId', async (req, res) => {
    try {
        const transactionId = req.params.transactionId;
        const { status } = req.body;

        const updatedPayment = await Payment.findOneAndUpdate(transactionId, { status }, { new: true });

        if (!updatedPayment) {
            return res.status(404).send('Payment not found');
        }

        res.json({ message: "Payment updated successfully", status: HTTP_STATUS_CODES.OK, payment: updatedPayment });
    } catch (error) {
        console.error('Error in updating payment:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
