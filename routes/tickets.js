const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Ticket = require('../models/tickets');
const ShowTime = require('../models/showTimes');
const Payment = require('../models/payments');
const User = require('../models/users');
const Screen = require('../models/screens');

const SERVICE_FEE_PER_TICKET = 1.50;

router.post('/book', async (req, res) => {
    try {
        const { userId, showTimeId, selectedSeats, cardDetails, modeOfPayment } = req.body;

        if (!userId || !showTimeId || !selectedSeats || selectedSeats.length === 0) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await User.findById(userId);
        const showTime = await ShowTime.findById(showTimeId).populate('movieId').populate('screenId');
        if (!user || !showTime) {
            return res.status(404).json({ message: 'User or Showtime not found' });
        }

        const screen = await Screen.findById(showTime.screenId._id);
        const unavailableSeats = selectedSeats.filter(seat => screen.seatArray.includes(seat));
        if (unavailableSeats.length > 0) {
            return res.status(400).json({ message: 'Selected seats are not available', unavailableSeats });
        }

        let totalCost = showTime.price * selectedSeats.length;
        let isPremiumMember = user.memberShipType === 'premium';
        if (!isPremiumMember) {
            totalCost += SERVICE_FEE_PER_TICKET * selectedSeats.length;
        }

        if (modeOfPayment === 'points') {
            if (user.rewardPoints < totalCost) {
                return res.status(400).json({ message: 'Insufficient reward points' });
            }

            user.rewardPoints -= totalCost;
            await user.save();
        } else if (modeOfPayment === 'card') {
            const newPayment = new Payment({
                transactionId: mongoose.Types.ObjectId(),
                cardDetails,
                status: 'pending',
                userId,
                modeOfPayment
            });

            await newPayment.save();

            //Payment gateway integration?
            const paymentSuccessful = true;

            if (!paymentSuccessful) {
                await Payment.findByIdAndUpdate(newPayment._id, { status: 'failed' });
                return res.status(400).json({ message: 'Payment failed, ticket not booked' });
            }

            await Payment.findByIdAndUpdate(newPayment._id, { status: 'completed' });

            let pointsToAccumulate = isPremiumMember ? showTime.price * selectedSeats.length : totalCost;
            user.rewardPoints += Math.floor(pointsToAccumulate);
            await user.save();
        } else {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        const newTicket = new Ticket({
            userId: mongoose.Types.ObjectId(userId),
            movieId: showTime.movieId._id,
            screenId: showTime.screenId._id,
            showTime: showTime.startTime,
            seatNos: selectedSeats,
            isActive: true
        });

        await newTicket.save();

        //TODO: Update screen's seatArray

        res.json({ message: 'Ticket booked successfully', status: HTTP_STATUS_CODES.Created, ticket: newTicket });
    } catch (error) {
        console.error('Error while booking ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/cancel', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const ticket = await Ticket.findById(userId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const currentTime = new Date();
        if (currentTime >= ticket.showTime) {
            return res.status(400).json({ message: 'Cancellation is not allowed past the showtime' });
        }

        const payment = await Payment.findOne({ transactionId: ticket.transactionId });
        if (!payment) {
            return res.status(404).json({ message: 'Associated payment record not found' });
        }

        if (payment.modeOfPayment === 'card') {
            // refund processing with payment gateway?
            const refundSuccessful = true;

            if (!refundSuccessful) {
                return res.status(400).json({ message: 'Refund failed' });
            }

            payment.status = 'refunded';
            await payment.save();

        } else if (payment.modeOfPayment === 'points') {
            const user = await User.findById(ticket.userId);
            user.rewardPoints += Math.Floor(ticket.cost);
            await user.save();
            payment.status = 'refunded';
            await payment.save();
        }

        ticket.isActive = false;
        await ticket.save();

        //TODO: Update seats

        res.json({ message: 'Ticket cancelled successfully', status: HTTP_STATUS_CODES.OK });
    } catch (error) {
        console.error('Error while cancelling ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/getAll', async (req, res) => {
    try {
        const tickets = await Ticket.find({});
        res.json({ message: 'Tickets retrieved successfully', status: HTTP_STATUS_CODES.OK, tickets });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/getByUserId/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const tickets = await Ticket.find({ userId: userId });
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: 'No tickets found for this user' });
        }

        res.json({ message: 'Tickets retrieved successfully', status: HTTP_STATUS_CODES.OK, tickets });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
