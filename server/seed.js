require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");
const Program = require("./models/Program");

const seed = async () => {
  await connectDB();

  // Seed Admin
  const existingAdmin = await Admin.findOne({ email: "admin@kohsha.com" });
  if (!existingAdmin) {
    await Admin.create({
      name: "Kohsha Admin",
      email: "admin@kohsha.com",
      password: "kohsha2024",
      role: "superadmin",
    });
    console.log("Admin user created: admin@kohsha.com / kohsha2024");
  } else {
    console.log("Admin user already exists");
  }

  // Seed Programs
  const programCount = await Program.countDocuments();
  if (programCount === 0) {
    await Program.insertMany([
      { programName: "Daycare", ageGroup: "1 - 3 Years", price: 4500, description: "A safe and nurturing environment for your little ones with engaging activities, nutritious meals, and loving care throughout the day." },
      { programName: "Toddler Club", ageGroup: "1.5 - 2.5 Years", price: 5000, description: "Fun-filled program designed to develop social skills, motor skills, and early learning through play-based activities." },
      { programName: "Nursery", ageGroup: "2.5 - 4 Years", price: 5500, description: "A structured curriculum combining academics and play to build a strong foundation for your child's future learning journey." },
      { programName: "K1", ageGroup: "4 - 5 Years", price: 6000, description: "Kindergarten 1 program focuses on reading readiness, number concepts, and creative expression through art and music." },
      { programName: "K2", ageGroup: "5 - 6 Years", price: 6500, description: "Advanced kindergarten program preparing children for primary school with comprehensive academic and life skills development." },
      { programName: "After School Activities", ageGroup: "3 - 10 Years", price: 3000, description: "Exciting after-school programs including dance, music, art, sports, and STEM activities to keep children engaged and learning." },
    ]);
    console.log("Programs seeded");
  } else {
    console.log("Programs already exist");
  }

  console.log("Seed complete");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
