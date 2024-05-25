const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    listPublicProfiles,
    listAllProfiles,
} = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.get('/profiles', listPublicProfiles);
router.get('/admin/profiles', authenticateToken, isAdmin, listAllProfiles);
module.exports = router;
