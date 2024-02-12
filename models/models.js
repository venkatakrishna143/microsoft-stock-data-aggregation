const mongoose = require('mongoose');

// Define schema for the stock data
const stockDataSchema = new mongoose.Schema({
    symbol: String,
    metaData: {
        information: String,
        symbol: String,
        lastRefreshed: Date,
        outputSize: String,
        timeZone: String
    },
    timeSeries: [{
        date: Date,
        open: Number,
        high: Number,
        low: Number,
        close: Number,
        volume: Number
    }]
});

// Create the Mongoose model from the schema
const StockData = mongoose.model('StockData', stockDataSchema);

module.exports = StockData;
