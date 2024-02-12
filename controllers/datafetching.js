const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;
const fetch = require('node-fetch');
const moment = require('moment');

//controllers
const StockData = require('../models/models');

// Financial market data API endpoint
const API_KEY = 'your_api_key';
const API_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=Microsoft&apikey=demo';

exports.GettingData = async (req, res, next) => {
    try {
        // mongoose.connect('mongodb://localhost:27017/stockdata', {});
        const API_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo'; // Replace with your API URL

        const response = await fetch(API_URL);
        const data = await response.json();
        const metaData = data['Meta Data'];
        const timeSeries = data['Time Series (Daily)'];
        const symbol = metaData['2. Symbol'];

        // console.log('jsondata', data);
        console.log('metaData', metaData['4. Output Size']);
        // console.log('timeSeries', timeSeries);
        // console.log('symbol', symbol);

        // Iterate over each date in timeSeries
        for (const [date, timeSeriesData] of Object.entries(timeSeries)) {
            const stockData = new StockData({
                symbol: symbol,
                metaData: {
                    information: metaData['1. Information'],
                    symbol: metaData['2. Symbol'],
                    lastRefreshed: moment(metaData.lastRefreshed).toDate(), // Parse date string using Moment.js
                    outputSize: metaData['4. Output Size'],
                    timeZone: metaData['5. Time Zone']
                },
                timeSeries: {
                    date: new Date(date),
                    open: parseFloat(timeSeriesData['1. open']),
                    high: parseFloat(timeSeriesData['2. high']),
                    low: parseFloat(timeSeriesData['3. low']),
                    close: parseFloat(timeSeriesData['4. close']),
                    volume: parseInt(timeSeriesData['5. volume']) // Use parseInt for integer values
                }
            });

            await stockData.save(); // Save each instance of StockData
        }

        console.log('Stock data fetched and stored successfully');
        // res.status(200).json({ message: 'Stock data fetched and stored successfully' });
    } catch (error) {
        console.error('Error fetching and storing stock data:', error);
        // res.status(500).json({ message: error.message });
    }
    // finally {
    //     // Close the MongoDB connection
    //     await mongoose.connection.close();
    //     console.log('MongoDB connection closed');
    // }
};