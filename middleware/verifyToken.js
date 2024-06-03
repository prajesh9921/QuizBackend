const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/user');

const Verify = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        if (!token) {
            res.status(401).json({message: "Unauthorized Access"});
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        // This is payload inside of decode. Another security factor for accessing data
        const isUserValid = User.findById(decode.id);

        if (!isUserValid) {
            res.status(401).json({message: "Unauthorized Access"});
        }
        next();
    } catch (err) {
        console.log("Error while verifying token",err);
    }
}

module.exports = Verify;