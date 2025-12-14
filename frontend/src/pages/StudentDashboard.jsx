import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
    // Start watching location
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (err) => {
          setError('Location access denied. Please enable GPS.');
          console.error(err);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/me');
      setHistory(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async () => {
    if (!location) {
      setError('Waiting for location...');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/attendance', {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setMessage(`Success! Marked attendance at ${res.data.locationName}`);
      fetchHistory(); // Refresh history
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Student Dashboard</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>
          <div className="text-right">
            {location ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <MapPin className="w-4 h-4 mr-1" /> GPS Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <XCircle className="w-4 h-4 mr-1" /> GPS Inactive
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 text-center">
          {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}
          {message && <div className="mb-4 text-green-600 font-medium">{message}</div>}

          <div className="mb-6">
             <p className="text-sm text-gray-500 mb-2">Current Coordinates:</p>
             <p className="font-mono text-gray-700">
               {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Getting location...'}
             </p>
             <p className="text-xs text-gray-400 mt-1">Accuracy: {location?.accuracy?.toFixed(1)}m</p>
          </div>

          <button
            onClick={handleMarkAttendance}
            disabled={loading || !location}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading || !location ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Verifying Location...' : 'Mark Attendance'}
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Attendance History</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {history.length > 0 ? (
              history.map((record) => (
                <li key={record._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {record.geofenceId?.name || 'Unknown Location'}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {record.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        Lat: {record.location.latitude.toFixed(4)}, Lng: {record.location.longitude.toFixed(4)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {new Date(record.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No attendance history found</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
