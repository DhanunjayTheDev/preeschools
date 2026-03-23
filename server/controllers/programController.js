const Program = require("../models/Program");

exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().sort({ programName: 1 });
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!program) return res.status(404).json({ message: "Program not found" });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
