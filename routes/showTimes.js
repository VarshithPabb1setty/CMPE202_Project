require('dotenv').config()
const express = require('express')
const router = express.Router();
const Screen = require('../models/screens');
const ShowTime = require('../models/showTimes');
const { HTTP_STATUS_CODES } = require('../constants')

router.post('/add', async (req, res) => {
    try {
        payload = req.body;
        const startTime = new Date(payload.startTime); // Convert startTime to a Date object
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000);

        const newShowTime = new ShowTime({
            movieId: payload.movieId,
            screenId: payload.screenId,
            startTime: startTime,
            endTime: endTime,
            price: payload.price,
            discountPrice: payload.discountPrice,
            seatsBooked: "",
            isActive: true
        });

        const createdShowTime = await newShowTime.save();
        res.json({ message: "Added show times successfully", status: HTTP_STATUS_CODES.OK, data: createdShowTime });
    } catch (error) {
        console.error('Error while adding screen:', error);
        res.json({
            message: "Internal Server Error",
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
});

router.get('/getAll', async (req, res) => {
    try {

        let showTimes = await ShowTime.find({ isActive: true });

        res.json({
            message: 'Record[s] found',
            status: HTTP_STATUS_CODES.OK,
            data: showTimes
        });
    }
    catch (err) {
        console.error('Error while fetching show times of particular movie:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});

router.get('/get/:id', async (req, res) => {
    try {
        let id = req.params.id;

        let showTime = await ShowTime.find({ _id: id, isActive: true});

        res.json({
            message: 'Record found',
            status: HTTP_STATUS_CODES.OK,
            data: showTime
        });
    }
    catch (err) {
        console.error('Error while fetching show times of particular movie:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});

router.get('/getAllMovies/:movieId', async (req, res) => {
    try {
        let movieId = req.params.movieId;

        let showTimesOfMovie = await ShowTime.find({ movieId: movieId, isActive: true});

        res.json({
            message: 'Records found',
            status: HTTP_STATUS_CODES.OK,
            data: showTimesOfMovie
        });
    }
    catch (err) {
        console.error('Error while fetching show times of particular movie:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});

router.get('/getAllScreens/:screenId', async (req, res) => {
    try {
        let screenId = req.params.screenId;

        let showTimesOfScreen = await ShowTime.find({ screenId: screenId, isActive: true});

        res.json({
            message: 'Records found',
            status: HTTP_STATUS_CODES.OK,
            data: showTimesOfScreen
        });
    }
    catch (err) {
        console.error('Error while fetching show times of particular movie:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});

router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;

        if (!id) {
            return res.status(500).send('movieId is required!!!');
        }

        // If startTime is being updated, also update endTime
        if (payload.startTime) {
            const updatedStartTime = new Date(payload.startTime);
            payload.endTime = new Date(updatedStartTime.getTime() + 2 * 60 * 60 * 1000 + 30 * 60 * 1000);
        }
        await ShowTime.findByIdAndUpdate(id, payload);
        res.json({ message: "Record updated", status: HTTP_STATUS_CODES.OK });
    } catch (error) {
        console.error('Error while updating a show time:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        if (req.params.id) {
            await ShowTime.findByIdAndUpdate( req.params.id, {isActive: false });
            res.json({ message: "Record deleted", status: HTTP_STATUS_CODES.OK });
        } else {
            res.status(500).send('id is required!!!');
        }
    } catch (error) {
        console.error('Error while deleting a show time:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;