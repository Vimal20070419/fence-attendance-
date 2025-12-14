const Attendance = require('../models/Attendance');
const { Parser } = require('json2csv');

exports.exportAttendance = async (req, res) => {
  try {
    const filters = {};
    // Optional: Filter by month/year if query params are present
    // if (req.query.date) { filters.dateString = req.query.date; }

    const records = await Attendance.find(filters).populate('user', 'name email phone').populate('geofenceId', 'name').sort({ date: -1 });

    const fields = [
      { label: 'Name', value: 'user.name' },
      { label: 'Email', value: 'user.email' },
      { label: 'Phone', value: 'user.phone' },
      { label: 'Date', value: 'dateString' },
      { label: 'Time', value: 'timeString' },
      { label: 'Status', value: 'status' },
      { label: 'Location', value: 'geofenceId.name' },
      { label: 'Lat', value: 'location.latitude' },
      { label: 'Lng', value: 'location.longitude' }
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(records);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance_report.csv');
    return res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Export failed' });
  }
};
