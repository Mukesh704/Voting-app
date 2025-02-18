const express = require('express')
const router = express.Router();
const Candidate = require('../models/Candidate')
const User = require('../models/User')

const {jwtAuthMiddleware} = require('../jwt')

router.post('/:candidateID', jwtAuthMiddleware, async(req, res) => {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;
    try {
        const candidate = await Candidate.findById(candidateID)
        if(!candidate) {
            return res.status(404).json({
                success: false,
                error: 'Candidate Not Found'
            })
        }

        const user = await User.findById(userID)
        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User Not Found'
            })
        }

        if(user.isVoted) {
            return res.status(400).json({
                success: false,
                error: 'You Have Already Voted'
            })
        }

        if(user.role == "admin") {
            return res.status(400).json({
                success: false,
                error: "Admin Is Not Allowed To Vote"
            })
        }

        // Update the candidate document to record the vote
        candidate.votes.push({user: userID});
        candidate.voteCount++;
        await candidate.save();

        // Update user vote status to true
        user.isVoted = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Voted Successfully'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

// Vote count
router.get('/count', async(req, res) => {
    try {
        // Find all candidates and sort them by voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })

        return res.status(200).json(voteRecord)
    } catch (arr) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

module.exports = router;