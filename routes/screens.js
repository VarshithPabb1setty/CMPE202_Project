require('dotenv').config()
const express = require('express')
const router = express.Router();
const Screen = require('../models/screens');
const ShowTime = require('../models/showTimes');
const defaultSeats = require('../Helpers/defaultSeats')
const { HTTP_STATUS_CODES } = require('../constants')

router.post('/add', async (req, res) => {
    try {
        payload = req.body;
        let seatConfig = payload.seats;
        if (!seatConfig || Object.keys(seatConfig).length === 0) {
            seatConfig = defaultSeats;
        }

        const defaultRows = 13;
        const defaultColumns = 12;

        const rows = payload.rows || defaultRows;
        const columns = payload.col || defaultColumns;

        const newScreen = new Screen({
            screenName: payload.screenName,
            screenType: payload.screenType,
            rows: rows,
            columns: columns,
            seatingCapacity: rows * columns,
            seatsAvailable: rows * columns,
            cost: payload.cost,
            seats: JSON.stringify(seatConfig),
            theatreId: payload.theatreId,
            isActive: true
        });

        const screen = await newScreen.save();
        res.json({ message: "Added screen successfully", status: HTTP_STATUS_CODES.OK, data: screen });
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
        const screens = await Screen.find({ isActive: true });
        if (screens.length) {
            const showTimes = await ShowTime.find({ isActive: true });

            if (showTimes.length) {
                screens.forEach(screen => {
                    // Filter screens for the current theatre
                    const showTimesList = showTimes.filter(showTime => showTime.screenId.toString() === screen._id.toString());
                    // Assign screensList to the current theatre
                    screen._doc.showTimesDetail = showTimesList; // Using _doc to directly modify the document
                });
            }
        } else {
            return res.json({
                message: 'No screens found',
                status: HTTP_STATUS_CODES.OK,
                data: []
            });
        }

        res.json({
            message: 'Records found',
            status: HTTP_STATUS_CODES.OK,
            data: screens
        });
    }
    catch (err) {
        console.error('Error while fetching theatres:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});

router.get('/get/:id', async (req, res) => {
    try {
        const screenId = req.params.id;

        const screen = await Screen.findOne({ _id: screenId, isActive: true });
        if (!screen) {
            return res.json({
                message: 'Screen not found',
                status: HTTP_STATUS_CODES.NOT_FOUND,
                data: null
            });
        }

        const showTimes = await ShowTime.find({ screenId: screen._id, isActive: true });

        // Include showTimes in the screen object
        screen._doc.showTimes = showTimes;

        res.json({
            message: 'Record found',
            status: HTTP_STATUS_CODES.OK,
            data: screen
        });
    } catch (err) {
        console.error('Error while fetching screen:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});


// // add showTimesList to each screen
// router.get('/get/:id', async (req, res) => {

//     try {
//         const theatre = await Theatre.find({ _id: req.params.id, isActive: true });
//         console.log(theatre);

//         if (theatre.length) {
//             const screens = await Screen.find({ theatreId: theatre[0]._doc._id, isActive: true });

//             if (screens.length) {
//                 theatre[0]._doc.screensList = screens;
//             } else {
//                 theatre[0]._doc.screensList = [];
//             }
//         } else {
//             res.json({
//                 message: 'No record found',
//                 status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
//             })
//         }

//         res.json({
//             message: 'Record found',
//             status: HTTP_STATUS_CODES.OK,
//             data: theatre
//         })

//     }
//     catch (err) {
//         console.log(err);
//         res.json({
//             message: 'Theatre Not found',
//             status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
//             data: JSON.stringify("")
//         })
//     }
// })

router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        if (payload.seats) {
            payload.seats = JSON.stringify(payload.seats);
        }
        if (id) {
            await Screen.findByIdAndUpdate(id, payload);
            res.json({ message: "Record updated", status: HTTP_STATUS_CODES.OK });
        } else {
            res.status(500).send('screenId is required!!!');
        }
    } catch (error) {
        console.error('Error while updating a screen:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.post('/delete/:id', async (req, res) => {
    try {
        if (req.params.id) {
            await Screen.findByIdAndUpdate(req.params.id, { isActive: false });
            res.json({ message: "Record deleted", status: HTTP_STATUS_CODES.OK });
        } else {
            res.status(500).send('screenId is required!!!');
        }
    } catch (error) {
        console.error('Error while deleting a screen:', error);
        res.status(500).send('Internal Server Error');
    }
})
module.exports = router;