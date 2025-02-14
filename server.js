const express = require('express');
const app = express();
const db = require('./db.js')
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes.js')

app.use('/user', userRoutes)

app.listen(PORT, () => {
    console.log('Server listening on port 3008')
})