require('dotenv').config()
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { HTTP_STATUS_CODES } = require('../constants')
const { createToken } = require('../Helpers/JwtAuth');
const uniqid = require('uniqid');
const saltRounds = 10;
// const { upload } = require('../index');
router.get('/addUser', (req, res) => {
    res.send('Hello, world!');
});

router.post('/signup', async (req, res) => {
    try {
        console.log(req.body);
        const payload = req.body;
        const password = await bcrypt.hash(payload.password, saltRounds);
        const newUser = new User({
            userId: uniqid(),
            fullName: payload.name,
            email: payload.email,
            password: password,
            firstName: '',
            lastName: '',
            dob: '',
            gender: '',
            mobile: '',
            genres: [],
            profileUrl: '',
            favouriteArtists: [],
            role: 'non-member',
            'memberShipType': 'none',
            isAdmin: false,
            isPrime: false,
            isActive: true
        });

        // Save the user to the database
        await newUser.save();
        res.json({ message: "User registered successfully", status: HTTP_STATUS_CODES.OK });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
})

router.post("/login", async (req, res) => {
    try {
        const payload = req.body;
        email = payload.email;
        password = payload.password;
        const users = await User.find({ email: email });
        console.log(users[0]);
        // users_obj = JSON.parse(users);
        // console.log(users_obj.password);
        if (users.length === 0) {
            res.json({
                message: 'user not found',
                status: HTTP_STATUS_CODES.NOT_FOUND
            })
        }
        else {
            data = { email: payload.email, fullName: users[0].fullName }
            createToken(req, res, email, password);
            console.log(res.getHeaders()['set-cookie']);
            password_match = await bcrypt.compare(password, users[0].password)
            if (password_match) {
                res.json({
                    message: 'user found',
                    status: HTTP_STATUS_CODES.OK,
                    data: JSON.parse(data)
                })
            }
            else {
                res.json({
                    message: 'password incorrect',
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                    data: JSON.parse(data)
                })
            }

        }

    }
    catch (error) {
        console.error('Error loggin in user', error);
        res.json({
            message: 'Uff..Somethin went wrong..Contact admin',
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
        })
    }
})

router.get('/viewProfile/:id', async (req, res) => {
    try {
        const user = await User.find({ _id: req.params.id, isActive: true });
        console.log(user);
        if (user.length) {
            res.json({
                message: 'Record found',
                status: HTTP_STATUS_CODES.OK,
                data: user
            })
        } else {
            res.json({
                message: 'No Record[s] found',
                status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            })
        }

    }
    catch (err) {
        console.log(err);
        res.json({
            message: 'User Not found',
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: JSON.stringify("")
        })
    }

})

router.post('/updateProfile', async (req, res) => {
    console.log(req.body);
    const payload = req.body;
    const user = await User.findOne({ email: payload.email });
    console.log(user);
    if (user) {
        user.firstName = payload.firstName
        user.lastName = payload.lastName
        user.dob = payload.birthDate
        user.gender = payload.gender
        user.mobile = payload.mobile
        user.genres = []
        user.memberShipType = payload.memberShipType ? payload.memberShipType : 'none'
        user.role = payload.role ? payload.role : 'none'
        // if (req.file)
        //     user.profileUrl = req.file.location
        user.favouriteArtists = [];
        await user.save();
        res.json({ message: "User details updated successfully", status: HTTP_STATUS_CODES.OK });
    } else {
        res.json({ message: "Cannot update user details", status: HTTP_STATUS_CODES.NOT_FOUND });
    }
});


module.exports = router;