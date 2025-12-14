const express = require('express');
const router = express.Router();
const { createGeofence, getGeofences } = require('../controllers/geofenceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'staff'), createGeofence);
router.get('/', protect, getGeofences);

module.exports = router;
