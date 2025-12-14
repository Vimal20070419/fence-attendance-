const express = require('express');
const router = express.Router();
const { markAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { exportAttendance } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, markAttendance);
router.get('/me', protect, getMyAttendance);
router.get('/export', protect, authorize('admin', 'staff'), exportAttendance);

module.exports = router;
