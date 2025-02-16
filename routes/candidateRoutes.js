const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate.js');
const User = require('../models/User.js');

const checkAdminRole = async(userId) => {
    try {
        const user = await User.findById(userId)
        return user.role === "admin"
    } catch (err) {
        return false
    }
}

router.post('/', async(req, res) => {
    try {
        if(!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({
                success: false,
                error: 'User is not Admin'
            })
        }

        const data = req.body
        const newCandidate = new Candidate(data)
        const response = await newCandidate.save()
        res.status(200).json({
            success: true,
            response: response
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

router.put('/:candidateID', async(req, res) => {
    try {
        if(!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({
                success: false,
                error: 'User is not admin'
            })
        }

        const candidateID = req.params.candidateID
        const updateCandidateData = req.body
        const response = await Candidate.findByIdAndUpdate(candidateID, updateCandidateData, {
            new: true,  // Return the updated document
            runValidators: true  // Run mongoose validation
        })

        if(!response) {
            return res.status(404).json({
                success: false,
                error: 'Candidate Not Found'
            })
        }

        console.log('Candidate Data Updated')
        res.status(200).json({
            success: true,
            response: response
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        })
    }
})

router.delete('/:candidateID', async(req, res) => {
    try {
        if(!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({
                success: false,
                error: 'User is not admin'
            })
        }

        const candidateID = req.params.candidateID
        const response = await Candidate.findByIdAndDelete(candidateID)

        if(!response) {
            return res.status(404).json({
                success: false,
                error: 'Candidate Not Found'
            })
        }

        console.log('Candidate Deleted')
        res.status(200).json({
            success: true,
            message: 'Candidate Deleted Successfully'
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