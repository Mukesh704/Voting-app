const jwt = require('jsonwebtoken')

const jwtAuthMiddleware = (req, res, next) => {
    // Check if the req header has the authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({
        success: false,
        error: 'Token Not Found'
    })

    // Extract the jwt token from the request header
    const token = req.headers.authorization.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        })
    }

    try {
        // Verifying the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach the user info to the request object
        req.user = decoded
        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        })
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET_KEY, {expiresIn: 300000});
}

module.exports = {jwtAuthMiddleware, generateToken}