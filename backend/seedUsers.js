const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
    {
        name: "Adalarasan R",
        email: "ceo@crestacore.in",
        phone: "63807 13874",
        role: "admin",
        password: "password123"
    },
    {
        name: "Yamunadevi M",
        email: "hr@crestacore.in",
        phone: "90470 41432",
        role: "admin",
        password: "password123"
    },
    {
        name: "Vaishnavi K",
        email: "vaishnavi@crestacore.in",
        phone: "93844 66370",
        role: "admin",
        password: "password123"
    },
    {
        name: "Vimal Kumar",
        email: "vimalkumar@crestacore.in",
        phone: "63817 78140",
        role: "staff",
        password: "password123"
    },
    {
        name: "Yamunadevi T",
        email: "Yamunadevi0703@crestacore.in",
        phone: "80150 23924",
        role: "student",
        password: "password123"
    },
    {
        name: "Roshini S",
        email: "Roshini0503@crestacore.in",
        phone: "95975 82972",
        role: "student",
        password: "password123"
    },
    {
        name: "Prajiththarun N",
        email: "Prajiththarun0403@crestacore.in",
        phone: "80728 77045",
        role: "student",
        password: "password123"
    },
    {
        name: "Tharun S",
        email: "tharun0503@crestacore.in",
        phone: "73972 61314",
        role: "student",
        password: "password123"
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Clear existing users? Maybe not, just upsert.
        // Or for this request, just loop and create/update.
        
        for (const user of users) {
             const existing = await User.findOne({ email: user.email });
             if (existing) {
                 console.log(`User ${user.email} exists. Updating info...`);
                 existing.name = user.name;
                 existing.phone = user.phone;
                 existing.role = user.role;
                 // Don't overwrite password blindly if it exists, but for initial seed maybe we should?
                 // Let's not reset password to keep it safe if they changed it.
                 // Unless it's a hard reset request. Let's just update meta.
                 await existing.save();
             } else {
                 console.log(`Creating user ${user.email}...`);
                 await User.create(user);
             }
        }

        console.log('Users seeded successfully!');
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
