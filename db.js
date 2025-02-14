const mongoose = require('mongoose');
require('dotenv').config()

const mongoURI = process.env.mongoURI

mongoose.connect(mongoURI)

const db = mongoose.connection

db.on('connected', () => {
    console.log('Connected to MongoDB server')
})

db.on('error', (err) => {
    console.log('MongoDB connection error: ', err)
})

db.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

module.exports = db;