const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    parentName: { type: String, required: true, trim: true },
    review: { type: String, required: true, trim: true, maxlength: 500 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    childProgram: {
      type: String,
      required: true,
      enum: ["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School Activities"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
