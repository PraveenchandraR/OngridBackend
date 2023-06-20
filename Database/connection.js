const mongoose = require('mongoose');

const connectToDB = async()=>{
    try {
        console.log("Trying to connect to DB...");
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB...");
    } catch (error) {
        console.log("Error while connecting to DB", error.message);
    }
}

module.exports = connectToDB;