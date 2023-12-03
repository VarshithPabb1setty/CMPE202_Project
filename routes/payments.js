const express = require('express');
const router = express.Router();

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

router.get('/:paymentId', async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).send('Payment not found');
        }

        res.json(payment);
    } catch (error) {
        console.error('Error in fetching payment:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/:paymentId', async (req, res) => {
    try {
        const paymentId = req.params.paymentId;
        const { status } = req.body;

        const updatedPayment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });

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
