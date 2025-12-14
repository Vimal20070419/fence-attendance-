const Geofence = require('../models/Geofence');

// @desc    Create a new geofence
// @route   POST /api/geofence
// @access  Private (Admin/Staff)
exports.createGeofence = async (req, res) => {
  try {
    const { name, latitude, longitude, radius } = req.body;

    const geofence = await Geofence.create({
      name,
      latitude,
      longitude,
      radius,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: geofence,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all geofences
// @route   GET /api/geofence
// @access  Private
exports.getGeofences = async (req, res) => {
  try {
    const geofences = await Geofence.find({ isActive: true });

    res.status(200).json({
      success: true,
      data: geofences,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
