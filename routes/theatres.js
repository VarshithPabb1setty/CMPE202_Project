require('dotenv').config();
const express = require('express');
const router = express.Router();
const { HTTP_STATUS_CODES } = require('../constants')
const Theatre = require('../models/theatres');
const Screen = require('../models/screens');
const Movie = require('../models/movies');
const ShowTime = require('../models/showTimes');

router.post('/add', async (req, res) => {
    try {
        const payload = req.body;
        const newTheatre = new Theatre({
            // theatreId: uniqid(),
            theatreName: payload.theatreName ? payload.theatreName : null,
            description: payload.description ? payload.description : null,
            state: payload.state ? payload.state : null,
            address: payload.address ? payload.address : null,
            zip: payload.zip ? payload.zip : null,
            contact: payload.contact ? payload.contact : null,
            city: payload.city ? payload.city : null,
            theatreUrl: payload.theatreUrl ? payload.theatreUrl : null,
            location: payload.location ? payload.location : null
        })
        console.log(newTheatre);
        await newTheatre.save();
        res.json({ message: "Theatre Created successfully", status: HTTP_STATUS_CODES.OK, data: newTheatre });
    }
    catch (err) {
        console.log(err);
        res.json({
            message: 'Error on creating theatre!!!',
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: JSON.stringify("")
        })

    }
})

router.get('/getAll', async (req, res) => {
    try {
        const theaters = await Theatre.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $lookup: {
                    from: 'screens',
                    localField: '_id',
                    foreignField: 'theatreId',
                    as: 'screensList'
                }
            },
            {
                $lookup: {
                    from: 'showtimes',
                    localField: 'screensList._id',
                    foreignField: 'screenId',
                    as: 'showTimesList'
                }
            },
            {
                $lookup: {
                    from: 'movies',
                    localField: 'showTimesList.movieId',
                    foreignField: '_id',
                    as: 'moviesList'
                }
            },
            {
                $project: {
                    theatreName: 1,
                    description: 1,
                    location: 1,
                    state: 1,
                    address: 1,
                    zip: 1,
                    contact: 1,
                    city: 1,
                    theatreUrl: 1,
                    isActive: 1,
                    moviesList: {
                        $map: {
                            input: '$moviesList',
                            as: 'movie',
                            in: {
                                $mergeObjects: [
                                    '$$movie',
                                    {
                                        showTimesList: {
                                            $filter: {
                                                input: '$showTimesList',
                                                as: 'showTime',
                                                cond: { $eq: ['$$movie._id', '$$showTime.movieId'] }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        ]);

        res.json({
            message: 'Records found',
            status: HTTP_STATUS_CODES.OK,
            data: theaters
        });
    } catch (err) {
        console.error('Error while fetching theatres:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});


router.get('/get/:id', async (req, res) => {

    try {
        const theatre = await Theatre.find({ _id: req.params.id, isActive: true });
        console.log(theatre);

        if (theatre.length) {
            const screens = await Screen.find({ theatreId: theatre[0]._doc._id, isActive: true });

            if (screens.length) {
                theatre[0]._doc.screensList = screens;
            } else {
                theatre[0]._doc.screensList = [];
            }
        } else {
            res.json({
                message: 'No record found',
                status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            })
        }

        res.json({
            message: 'Record found',
            status: HTTP_STATUS_CODES.OK,
            data: theatre
        })

    }
    catch (err) {
        console.log(err);
        res.json({
            message: 'Theatre Not found',
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: JSON.stringify("")
        })
    }
})

router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        if (id) {
            await Theatre.findByIdAndUpdate({ _id: id, isActive: true }, payload);
            res.json({ message: "Record updated", status: HTTP_STATUS_CODES.OK });
        } else {
            res.status(500).send('movieId is required!!!');
        }
    } catch (error) {
        console.error('Error while updating a movie:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/delete/:id', async (req, res) => {
    try {
        if (req.params.id) {
            await Theatre.findByIdAndUpdate( req.params.id, { isActive: false });
            res.json({ message: "Record deleted", status: HTTP_STATUS_CODES.OK });
        } else {
            res.status(500).send('id is required!!!');
        }
    } catch (error) {
        console.error('Error while deleting a movie:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router; 