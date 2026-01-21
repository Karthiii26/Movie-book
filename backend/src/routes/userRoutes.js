const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile } = require('../controllers/UserController');
const { protect } = require('../middleware/AuthMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
