const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cron = require('node-cron');

//controllers
const { GettingData } = require('./controllers/datafetching');
const trendAnalysis = require('./routes/controllers');

//DB connection
const connectDB = require('./database/database');
connectDB();

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//cors implement
app.use(
  cors({
    origin: "*",
    allowedHeaders: "*",
  })
);

// middleware's
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined"));

//api endpoints
app.use('/ops', trendAnalysis);

//cron jobs
cron.schedule('*/60 * * * * *', () => {
  console.log(`running cron job for every minute`);
  GettingData();
});