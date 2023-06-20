const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }
},{timestamps: true});

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    organisation: {
        type: String,
        required: true
    },
    known: {
        type: String,
        required: true
    }
}, { timestamps: true });





const UserModel = mongoose.model("users", userSchema);
const BookModel = mongoose.model("bookings", bookSchema);


module.exports = {UserModel, BookModel };