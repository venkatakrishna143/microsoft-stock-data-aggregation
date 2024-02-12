const mongoose = require('mongoose');
const StockData = require('../models/models');
const math = require('mathjs');


// Trend Analysis using start and end dates
exports.trendAnalysis = async (req, res, next) => {
    const { startDate, endDate } = req.body;
    if ((startDate == '' || startDate == undefined) || (endDate == '' || endDate == undefined)) {
        res.json({ message: 'Please provide a start and end date', statuscode: 404 });
    } else {
        try {
            const data = await StockData.find({ 'timeSeries.date': { $gte: startDate, $lte: endDate } }).sort({ 'timeSeries.date': 1 });

            if (!data || !data.length) {
                throw new Error('No data found for the specified date range');
            }

            // Perform trend analysis based on closing prices
            // You can implement more sophisticated trend analysis algorithms here
            // For demonstration, let's just check if the last closing price is higher than the first one
            const trend = data[data.length - 1].timeSeries.close > data[0].timeSeries.close ? 'Upward' : 'Downward';

            console.log(`Trend Analysis: ${trend}`);
            res.status(200).json({ success: true, data: trend });
        } catch (error) {
            console.error('Error fetching and processing data:', error.message);
            res.status(500).json({ error: error.message });
        }
    }
};


// Moving averages
exports.movingAverages = async (req, res, next) => {
    const { days } = req.body;
    if (days == null || days == undefined || days == "") {
        return res.status(404).json({ message: "Missing days" });
    }

    try {
        const data = await StockData.find().sort({ 'timeSeries.date': 1 });

        // Flatten the closing prices into a single array
        const closingPrices = data.reduce((acc, item) => {
            return acc.concat(item.timeSeries.map(entry => entry.close));
        }, []);

        // Calculate moving average
        const movingAverages = [];
        for (let i = 0; i < closingPrices.length - Number(days) + 1; i++) {
            const slice = closingPrices.slice(i, i + Number(days));
            const average = math.mean(slice);
            movingAverages.push(average);
        }

        res.status(200).json({ success: true, data: `${days}-day Moving Average`, value: movingAverages[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.volatilityAnalysis = async (req, res, next) => {
    try {
        const data = await StockData.aggregate([
            { $unwind: "$timeSeries" }, // Unwind the timeSeries array
            { $sort: { "timeSeries.date": 1 } } // Sort based on the date within timeSeries
        ]);
        console.log("data", data.length); // Log the data to see its structure and contents

        const closingPrices = data.map(item => item.timeSeries.close);
        console.log('closingPrices:', closingPrices); // Log the closing prices to see if they are extracted correctly

        if (closingPrices.length === 0) {
            console.error('Closing prices array is empty.');
            return res.status(500).json({ message: 'Closing prices array is empty.' });
        }

        const volatility = math.std(closingPrices);
        console.log("Volatility: " + volatility);

        res.status(200).json({ success: true, data: `Volatility: ${volatility}` });
        return volatility;
    } catch (error) {
        console.error('Error performing volatility analysis:', error);
        res.status(500).json({ message: error.message });
    }
};