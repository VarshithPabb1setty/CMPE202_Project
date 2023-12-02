require('dotenv').config()
const express = require('express')
const router = express.Router();
const Movie = require('../models/movies'); 
const Theatre = require('../models/theatres');
const Screen = require('../models/screens');
const ShowTime = require('../models/showTimes');
const uniqid = require('uniqid');
const { HTTP_STATUS_CODES } = require('../constants')

router.post('/add', async (req, res) => {
    try {
        console.log(req.body);
        const payload = req.body;
        const newMovie = new Movie({
            // movieId: uniqid(),
            title: payload.title,
            cast: payload.cast && payload.cast.length ? payload.cast : null,
            crew: payload.crew && payload.crew.length ? payload.crew : null,
            description: payload.description ? payload.description : null,
            format: payload.format ? payload.format : null,
            genres: payload.genres && payload.genres.length ? payload.genres : null,
            languages: payload.languages && payload.languages.length ? payload.languages : null,
            runTime: payload.runTime ? payload.runTime : null,
            rating: payload.rating ? payload.rating : null,
            movieTrailerUrl: payload.movieTrailerUrl ? payload.movieTrailerUrl : null,
            releaseDate: payload.releaseDate ? payload.releaseDate : null,
            ticketPrice: payload.ticketPrice ? payload.ticketPrice : null,
            ticketsSold: payload.ticketsSold ? payload.ticketsSold : null,
            posterUrl: payload.posterUrl ? payload.posterUrl : null,
            certificate: payload.certificate ? payload.certificate : null,
            popularity: payload.popularity ? payload.popularity : null,
            isActive: true
        });

        // Save the movie to the database
        const movie = await newMovie.save();
        res.json({ message: "Added movie successfully", status: HTTP_STATUS_CODES.OK,  movie: movie });
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const movies = await Movie.find({ isActive: true });
        res.json({ message: "Record[s] found", status: HTTP_STATUS_CODES.OK, movies: movies });
    } catch (error) {
        console.error('Error on getting list of movies:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.get('/get/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const theatres = await Theatre.find({}); // You can add conditions if needed

        // Iterate through theatres to fetch screens and showtimes
        const theatresWithScreensAndShowtimes = [];
        for (const theatre of theatres) {
            const screens = await Screen.find({ theatreId: theatre._id });
            const screensWithShowtimes = [];

            for (const screen of screens) {
                const showtimes = await ShowTime.find({ screenId: screen._id, movieId });
                if (showtimes.length > 0) {
                    screensWithShowtimes.push({
                        ...screen._doc,
                        showtimes,
                    });
                }
            }

            if (screensWithShowtimes.length > 0) {
                theatresWithScreensAndShowtimes.push({
                    ...theatre._doc,
                    screens: screensWithShowtimes,
                });
            }
        }

        const response = {
            movie,
            theatres: theatresWithScreensAndShowtimes,
        };

        res.json({ message: "Record updated", status: HTTP_STATUS_CODES.OK, data: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//     try {
//         const id = req.params.id;
//         let showTimes = [];

//         // Find the movie by ID
//         const movie = await Movie.findById({_id: id, isActive: true });
//         if (!movie) {
//             return res.status(404).send('Movie not found');
//         }

//         // Find screens showing this movie
//         const screens = await Screen.find({ id: movie._id }).populate('theatreId');

//         // Organize data
//         const theatreData = {};
//         for (const screen of screens) {
//             const theatreId = screen.theatreId._id;
//             if (!theatreData[theatreId]) {
//                 const theatre = await Theatre.findById(theatreId);
//                 theatreData[theatreId] = {
//                     theatre: theatre,
//                     screens: []
//                 };
//             }
//             theatreData[theatreId].screens.push(screen);
//         }

//         showTimes = ShowTime.find({ movieId: id, isActive: true });


//         res.json({
//             movie: movie,
//             theatres: Object.values(theatreData),
//             showTimes: showTimes
//         });
//     } catch (error) {
//         console.error('Error while fetching movie:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.post('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        if (id) {
            await Movie.findByIdAndUpdate(id, payload);
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
            await Movie.findByIdAndUpdate( req.params.id, {isActive: false });
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