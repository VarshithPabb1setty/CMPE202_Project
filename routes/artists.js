require('dotenv').config()
const express = require('express')
const router = express.Router();
const Artist = require('../models/artists');
const Movies = require('../models/movies');
const uniqid = require('uniqid');
const { HTTP_STATUS_CODES } = require('../constants')



router.post('/create', async (req, res) => {
    try {
        console.log(req.body);
        const payload = req.body;
        const newArtist = new Artist({
            artistId: uniqid(),
            artistName: payload.artistName ? payload.artistName : null,
            profileUrl: payload.profileUrl ? payload.profileUrl : null,
            roleType: payload.roletype ? payload.roletype : null
        });

        // Save the user to the database
        await newArtist.save();
        res.json({ message: "Added artist successfully!!!", status: HTTP_STATUS_CODES.OK });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/getArtistInfo', async (req, res) => {
    try {
        console.log(req.body);
        const payload = req.body;
        const artistData = await Artist.find({ artistId: payload.artistId, artistName: payload.artistName});
        // console.log(artistData);
        // artistData = JSON.parse(artistData);

        if (artistData.length) {
            const artistActedMovies =  
            console.log("artistData", artistData);

        } else {
            res.json({
                message: 'Artist not found!!!',
                status: HTTP_STATUS_CODES.NOT_FOUND
            })
        }

        // Save the user to the database
        // await newArtist.save();
        res.json({ message: "Added movie successfully", status: HTTP_STATUS_CODES.OK });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;