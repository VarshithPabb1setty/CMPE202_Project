require('dotenv').config()
const express = require('express')
const router = express.Router();
const { status, Screen } = require('../models/screens');
const { HTTP_STATUS_CODES } = require('../constants')

// router.post('/add', async (req, res) => {
//     try {
//         payload = req.body;
//         console.log(payload);
//         const seatArray = []
//         Object.entries(payload.seats).forEach(([row, col]) => {
//             seatArray.push({
//                 Row: `${row}`,
//                 Status: col
//             })
//         });
//         console.log('at /addScreeen');
//         const count = await Screen.countDocuments({ theatreId: payload.theatreId });
//         const newScreen = new Screen({
//             screenId: `${payload.screenName}_${count + 1}`,
//             screenName: payload.screenName,
//             showTimes: payload.showTimes,
//             screenType: payload.screenType,
//             rows: payload.rows,
//             columns: payload.col,
//             seatingCapacity: payload.rows * payload.col,
//             cost: payload.cost,
//             seatArray: seatArray,
//             theatreId: payload.theatreId,
//             isActive: true
//         });
//         // Save the Screen to the database
//         await newScreen.save();
//         res.json({ message: "Added screen successfully", status: HTTP_STATUS_CODES.OK });
//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.json({
//             message: "Internal Server Error",
//             status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
//         })
//     }
// })

router.post('/screens/add', async (req, res) => {
    try {
        payload = req.body;
        const newScreen = new Screen({
            screenId: `${payload.screenName}_${count + 1}`,
            screenName: payload.screenName,
            showTimes: payload.showTimes,
            screenType: payload.screenType,
            rows: payload.rows,
            columns: payload.col,
            seatingCapacity: payload.rows * payload.col,
            cost: payload.cost,
            seatArray: seatArray,
            theatreId: payload.theatreId,
            isActive: true
        });

        const savedScreen = await newScreen.save();

        // Optionally update the theatre document to include this new screen
        await Theatre.findByIdAndUpdate(payload.theatreId, { $push: { screens: savedScreen._id }});

        res.status(201).json(savedScreen);
    } catch (error) {
        console.error('Error while adding new screen:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/getAllScreens', async (req, res) => {
    try {

        // Save the user to the database
        const screen = await Screen.find({ isActive: true });
        res.json({ message: "Screens Found", status: HTTP_STATUS_CODES.OK, screens: screen });
    } catch (error) {
        console.error('Error creating user:', error);
        res.json({
            message: "Internal Server Error",
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
})

module.exports = router;