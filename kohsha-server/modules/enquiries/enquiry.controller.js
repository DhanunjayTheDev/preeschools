const enquiryService = require('./enquiry.service');

const create = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.createEnquiry(req.body);
    res.status(201).json({ message: 'Enquiry created', enquiry });
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const result = await enquiryService.getEnquiries(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.getEnquiryById(req.params.id);
    res.json({ enquiry });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.updateEnquiry(req.params.id, req.body);
    res.json({ message: 'Enquiry updated', enquiry });
  } catch (error) { next(error); }
};

const updateStatus = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.updateStatus(req.params.id, req.body.status, req.user._id);
    res.json({ message: 'Status updated', enquiry });
  } catch (error) { next(error); }
};

const addNote = async (req, res, next) => {
  try {
    const enquiry = await enquiryService.addNote(req.params.id, req.body.text, req.user._id);
    res.json({ message: 'Note added', enquiry });
  } catch (error) { next(error); }
};

const convert = async (req, res, next) => {
  try {
    const result = await enquiryService.convertToStudent(req.params.id, req.body, req.user._id);
    res.json({ message: 'Enquiry converted to student', ...result });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await enquiryService.deleteEnquiry(req.params.id);
    res.json({ message: 'Enquiry deleted' });
  } catch (error) { next(error); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await enquiryService.getStats();
    res.json(stats);
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, updateStatus, addNote, convert, remove, getStats };
