const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  dateString: { type: String }, // e.g., "2023-10-27"
  timeString: { type: String }, // e.g., "10:30:00"
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present',
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  geofenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Geofence',
  },
  deviceInfo: {
    type: String, // To store User Agent or Device ID for basic "one device" check logging
  },
  ipAddress: {
    type: String,
  },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
