const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware, generateToken} = require('../jwt.js')
const User = require('./../models/User.js')

router.post('/signup', async(req, res) => {
    try {
        const data = req.body;

        const newUser = new User(data)
        const response = await newUser.save()
        console.log('Data saved')

        const payload = {
            id: response.id
        }
        const token = generateToken(payload)

        res.status(200).json({
            success: true,
            response: response,
            token: token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

router.post('/login', async(req, res) => {
    try {
        const {aadharCardNumber, password} = req.body;
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                error: 'Invalid Aadhar Number Or Password'
            })
        }

        const payload = {
            id: user.id
        }
        const token = generateToken(payload)
        res.json({token})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

router.get('/profile', jwtAuthMiddleware, async(req, res) => {
    try {
        const userData = req.user       // using decoded data from token
        const userId = userData.id
        const user = await User.findById(userId)
        res.status(200).json({user})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

router.post('/profile/password', jwtAuthMiddleware, async(req, res) => {
    try {
        const userId = req.user.id
        const {currentPassword, newPassword} = req.body

        const user = await User.findById(userId)

        if(!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect Username Or Password'
            })
        }

        user.password = newPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

module.exports = router;