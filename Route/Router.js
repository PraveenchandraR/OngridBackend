const route = require('express').Router();
const userFunc = require('../Controller/userController');
const middleFunc = require('../Middleware/userMiddleware');


route.post('/signup', userFunc.signup);
route.post('/login',userFunc.login );
route.post('/bookdemo', userFunc.bookDemo);
route.post('/userdetails',userFunc.userdetails)


module.exports = route;