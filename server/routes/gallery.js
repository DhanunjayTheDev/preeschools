const express = require("express");
const router = express.Router();
const { uploadImage, getAllImages, deleteImage } = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getAllImages);
router.post("/upload", protect, upload.single("image"), uploadImage);
router.delete("/:id", protect, deleteImage);

module.exports = router;
