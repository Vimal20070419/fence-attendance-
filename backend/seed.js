const mongoose = require('mongoose');
const Geofence = require('./src/models/Geofence');
require('dotenv').config();

const seedGeofence = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const geofence = {
            name: "CrestaCore ARPA (ESEC)",
            latitude: 11.3142, // Approx from search result 11°18′51″N
            longitude: 77.5514, // Approx from search result 77°33′05″E
            radius: 100,
            isActive: true
        };

        const existing = await Geofence.findOne({ name: geofence.name });
        if (existing) {
            console.log('Geofence already exists. Updating...');
            existing.latitude = geofence.latitude;
            existing.longitude = geofence.longitude;
            await existing.save();
        } else {
            await Geofence.create(geofence);
            console.log('Geofence created!');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedGeofence();
