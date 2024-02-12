const express = require('express');
const router = express.Router();
const user = require('../controllers/controllers');

//routes
router.post('/trendanalysis', user.trendAnalysis);
router.post('/movingaverages', user.movingAverages);
router.post('/volatilityAnalysis', user.volatilityAnalysis);

module.exports = router;