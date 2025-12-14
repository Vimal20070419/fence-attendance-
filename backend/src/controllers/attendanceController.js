const Attendance = require('../models/Attendance');
const Geofence = require('../models/Geofence');
const { getDistanceFromLatLonInM } = require('../utils/location');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private (Student)
exports.markAttendance = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: 'Location data is required' });
  }

  try {
    // 1. Get all active geofences
    const geofences = await Geofence.find({ isActive: true });

    let insideGeofence = false;
    let matchedGeofence = null;

    // 2. Check if user is inside any geofence
    for (const fence of geofences) {
      const distance = getDistanceFromLatLonInM(latitude, longitude, fence.latitude, fence.longitude);
      
      if (distance <= fence.radius) {
        insideGeofence = true;
        matchedGeofence = fence;
        break; // Stop checking if found one
      }
    }

    if (!insideGeofence) {
      return res.status(400).json({ 
        success: false, 
        message: 'You are outside the designated area. Cannot mark attendance.' 
      });
    }

    // 3. Mark attendance
    const now = new Date();
    const attendance = await Attendance.create({
      user: req.user.id,
      location: { latitude, longitude },
      geofenceId: matchedGeofence._id,
      ipAddress: req.ip,
      deviceInfo: req.headers['user-agent'],
      date: now,
      dateString: now.toISOString().split('T')[0],
      timeString: now.toLocaleTimeString('en-US', { hour12: false }),
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance,
      locationName: matchedGeofence.name
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/me
// @access  Private
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user.id })
      .populate('geofenceId', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
