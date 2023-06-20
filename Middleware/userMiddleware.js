const jwt = require('jsonwebtoken');

const requiresSignIn = async(req, res, next)=>{
    try {
        const verify = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        )
        next(); 
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    requiresSignIn
}