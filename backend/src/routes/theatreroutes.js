const express = require('express');
const router = express.Router();
const { getTheatres, createTheatre } = require('../controllers/TheatreController');
const { protect, admin } = require('../middleware/AuthMiddleware');

router.get('/', getTheatres);
router.post('/', protect, admin, createTheatre);

module.exports = router;
