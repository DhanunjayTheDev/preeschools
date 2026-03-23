const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const {
  createAdmission,
  getAllAdmissions,
  updateAdmission,
  deleteAdmission,
  getAdmissionStats,
} = require("../controllers/admissionController");
const { protect } = require("../middleware/auth");

router.post(
  "/",
  [
    body("parentName").trim().notEmpty().withMessage("Parent name is required"),
    body("childName").trim().notEmpty().withMessage("Child name is required"),
    body("age").isInt({ min: 1, max: 10 }).withMessage("Age must be between 1 and 10"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("program").isIn(["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School Activities"]).withMessage("Invalid program"),
  ],
  createAdmission
);

router.get("/", protect, getAllAdmissions);
router.get("/stats", protect, getAdmissionStats);
router.patch("/:id", protect, updateAdmission);
router.delete("/:id", protect, deleteAdmission);

module.exports = router;
