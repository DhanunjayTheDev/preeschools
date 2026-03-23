const express = require("express");
const router = express.Router();
const { getAllPrograms, createProgram, updateProgram } = require("../controllers/programController");
const { protect } = require("../middleware/auth");

router.get("/", getAllPrograms);
router.post("/", protect, createProgram);
router.patch("/:id", protect, updateProgram);

module.exports = router;
