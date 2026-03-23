const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true, trim: true },
    childName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 10 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    program: {
      type: String,
      required: true,
      enum: ["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School Activities"],
    },
    message: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admission", admissionSchema);
