const Admission = require("../models/Admission");

exports.createAdmission = async (req, res) => {
  try {
    const admission = await Admission.create(req.body);
    res.status(201).json({ message: "Application submitted successfully", admission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAdmissions = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const admissions = await Admission.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Admission.countDocuments(filter);
    res.json({ admissions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAdmission = async (req, res) => {
  try {
    const { status } = req.body;
    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!admission) return res.status(404).json({ message: "Admission not found" });
    res.json(admission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) return res.status(404).json({ message: "Admission not found" });
    res.json({ message: "Admission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdmissionStats = async (req, res) => {
  try {
    const total = await Admission.countDocuments();
    const pending = await Admission.countDocuments({ status: "pending" });
    const approved = await Admission.countDocuments({ status: "approved" });
    const rejected = await Admission.countDocuments({ status: "rejected" });
    res.json({ total, pending, approved, rejected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
