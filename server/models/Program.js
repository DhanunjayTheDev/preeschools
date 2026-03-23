const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    programName: {
      type: String,
      required: true,
      enum: ["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School Activities"],
    },
    ageGroup: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Program", programSchema);
