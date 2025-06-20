const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth'); // Add this line

// Public routes (no protection)
router.post('/register', register);
router.post('/login', login);

// Protected test route (add temporarily)
router.get('/test-protected', protect, (req, res) => {
  res.json({ message: 'You are authenticated!' });
});

module.exports = router;