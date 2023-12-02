require('dotenv').config()
const express = require('express')
const router = express.Router();
const Screen = require('../models/screens');
const ShowTime = require('../models/showTimes');
const { HTTP_STATUS_CODES } = require('../constants')

router.post('/add', async (req, res) => {
    try {
        payload = req.body;
        const newScreen = new Screen({
            screenName: payload.screenName,
            screenType: payload.screenType,
            rows: payload.rows,
            columns: payload.col,
            seatingCapacity: payload.rows * payload.col,
            cost: payload.cost,
            theatreId: payload.theatreId,
            isActive: true
        });

        await newScreen.save();
        res.json({ message: "Added screen successfully", status: HTTP_STATUS_CODES.OK });
    } catch (error) {
        console.error('Error while adding screen:', error);
        res.json({
            message: "Internal Server Error",
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
});

// router.get('/getAllScreens', async (req, res) => {
//     try {

//         // Save the user to the database
//         const screen = await Screen.find({ isActive: true });
//         res.json({ message: "Screens Found", status: HTTP_STATUS_CODES.OK, screens: screen });
//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.json({
//             message: "Internal Server Error",
//             status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
//         })
//     }
// })

router.post('/getAll', async (req, res) => {
    try {
        const screens = await Screen.find( { isActive: true});
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
            data: theatres
        });
    }
    catch (err) {
        console.error('Error while fetching theatres:', err);
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send('Internal Server Error');
    }
});

// add showTimesList to each screen
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
            await Screen.findByIdAndUpdate( req.params.id, {isActive: false });
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