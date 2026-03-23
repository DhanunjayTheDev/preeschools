const Gallery = require("../models/Gallery");
const fs = require("fs");
const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const { title, category } = req.body;
    if (!title || !category) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Title and category are required" });
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;
    const gallery = await Gallery.create({
      title,
      imageUrl,
      category,
      uploadedBy: req.admin._id,
    });

    res.status(201).json(gallery);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const images = await Gallery.find(filter).sort({ createdAt: -1 }).populate("uploadedBy", "name");
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    const filePath = path.join(__dirname, "..", image.imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
