const route = require('express').Router();
const userFunc = require('../Controller/userController');
const middleFunc = require('../Middleware/userMiddleware');


route.post('/signup', userFunc.signup);
route.post('/login',userFunc.login );
route.post('/bookDemo', middleFunc.requiresSignIn, userFunc.bookDemo);


module.exports = route;