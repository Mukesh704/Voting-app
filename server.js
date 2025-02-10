const express = require('express');
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); //req.body
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(PORT, () => {
    console.log('Server listening on port 3008')
})