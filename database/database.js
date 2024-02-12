const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        mongoose.connect('mongodb://localhost:27017/stockdata', {});
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    };
}


module.exports = connectDB;