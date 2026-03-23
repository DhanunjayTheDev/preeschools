const express = require("express");
const router = express.Router();
const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect } = require("../middleware/auth");

router.get("/", getAllTestimonials);
router.post("/", protect, createTestimonial);
router.patch("/:id", protect, updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

module.exports = router;
