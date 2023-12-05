require('dotenv').config()
const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { HTTP_STATUS_CODES } = require('../constants')
const { createToken } = require('../Helpers/JwtAuth');
// const uniqid = require('uniqid');
const saltRounds = 10;
const Ticket = require('../models/tickets');
const Payment = require('../models/payments');
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
            // userId: uniqid(),
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
            role: payload.role ? payload.role : 'non-member',
            memberShipType: payload.memberShipType ? payload.memberShipType: 'regular',
            isAdmin: payload.role && payload.role === 'admin' ? true : false,
            isPrime: payload.memberShipType && payload.memberShipType === 'premium' ? true : false,
            isActive: true
        });

        // Save the user to the database
        const user = await newUser.save();
        res.json({ message: "User registered successfully", status: HTTP_STATUS_CODES.OK, data: user });
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
            let token = createToken(req, res, email, password);
            users[0]._doc.token = token;
            console.log(res.getHeaders()['set-cookie']);
            password_match = await bcrypt.compare(password, users[0].password)
            if (password_match) {
                res.json({
                    message: 'user found',
                    status: HTTP_STATUS_CODES.OK,
                    data: users[0]
                })
            }
            else {
                res.json({
                    message: 'password incorrect',
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                    data: data
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
    try {
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
            user.role = payload.role ? payload.role : 'non-member'
            // if (req.file)
            //     user.profileUrl = req.file.location
            user.favouriteArtists = [];
            await user.save();
            res.json({ message: "User details updated successfully", status: HTTP_STATUS_CODES.OK });
        } else {
            res.json({ message: "Cannot update user details", status: HTTP_STATUS_CODES.NOT_FOUND });
        }
    } catch (error) {
        console.error('Error while updating profile:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/purchaseHistory/:id', async (req, res) => {
    try {
        const ticketsPurchased = await Ticket.find({ userId: req.params.id, isActive: true});

        if (!ticketsPurchased) {
            res.json({ message: "0 Record[s] found", status: HTTP_STATUS_CODES.OK, data: [] });
        } else {
            res.json({ message: "Record[s] found", status: HTTP_STATUS_CODES.OK, data: ticketsPurchased });
        }
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/upgradeMembership', async (req, res) => {
    try {
        const { userId, cardDetails, modeOfPayment } = req.body; // I dunno if reward point can be used to upgrade membership

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.memberShipType === 'premium') {
            return res.status(400).json({ message: 'User is already a premium member' });
        }

        // Payment gateway integration?
        const paymentSuccessful = true; //

        if (!paymentSuccessful) {
            return res.status(400).json({ message: 'Payment failed' });
        }

        const newPayment = new Payment({
            transactionId: mongoose.Types.ObjectId(),
            cardDetails, 
            status: 'completed',
            userId,
            modeOfPayment
        });

        await newPayment.save();
        user.memberShipType = 'premium';
        await user.save();

        res.json({ message: 'Membership upgraded to premium successfully',status: HTTP_STATUS_CODES.OK, user });
    } catch (error) {
        console.error('Error in upgrading membership:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;