const feeService = require('./fee.service');
const Student = require('../students/student.model');

// Fee Plans
const createFeePlan = async (req, res, next) => {
  try {
    const plan = await feeService.createFeePlan(req.body, req.user._id);
    res.status(201).json({ message: 'Fee plan created', plan });
  } catch (error) { next(error); }
};

const getFeePlans = async (req, res, next) => {
  try {
    const plans = await feeService.getFeePlans(req.query);
    res.json({ plans });
  } catch (error) { next(error); }
};

const getFeePlanById = async (req, res, next) => {
  try {
    const plan = await feeService.getFeePlanById(req.params.id);
    res.json({ plan });
  } catch (error) { next(error); }
};

const updateFeePlan = async (req, res, next) => {
  try {
    const plan = await feeService.updateFeePlan(req.params.id, req.body);
    res.json({ message: 'Fee plan updated', plan });
  } catch (error) { next(error); }
};

const deleteFeePlan = async (req, res, next) => {
  try {
    await feeService.deleteFeePlan(req.params.id);
    res.json({ message: 'Fee plan deleted' });
  } catch (error) { next(error); }
};

// Fee Assignments
const assignFeePlan = async (req, res, next) => {
  try {
    const assignment = await feeService.assignFeePlan(req.body.studentId, req.body.feePlanId);
    res.status(201).json({ message: 'Fee plan assigned', assignment });
  } catch (error) { next(error); }
};

const getStudentFees = async (req, res, next) => {
  try {
    const fees = await feeService.getStudentFees(req.params.studentId);
    res.json({ fees });
  } catch (error) { next(error); }
};

const getMyFees = async (req, res, next) => {
  try {
    const students = await Student.find({ parentUser: req.user._id });
    const allFees = [];
    for (const student of students) {
      const fees = await feeService.getStudentFees(student._id);
      allFees.push({ student, fees });
    }
    res.json({ studentFees: allFees });
  } catch (error) { next(error); }
};

const getFeeAssignments = async (req, res, next) => {
  try {
    const result = await feeService.getFeeAssignments(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

// Payments
const recordPayment = async (req, res, next) => {
  try {
    const result = await feeService.recordPayment(req.body, req.user._id);
    res.status(201).json({ message: 'Payment recorded', ...result });
  } catch (error) { next(error); }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const result = await feeService.getPaymentHistory(req.params.studentId, req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const getAllPayments = async (req, res, next) => {
  try {
    const result = await feeService.getPaymentHistory(null, req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const downloadReceipt = async (req, res, next) => {
  try {
    const { Payment: PaymentModel } = require('./fee.model');
    const payment = await PaymentModel.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    const student = await Student.findById(payment.student);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${payment.receiptNumber}.pdf`);
    const doc = feeService.generateReceipt(payment, student);
    doc.pipe(res);
    doc.end();
  } catch (error) { next(error); }
};

const getFeeStats = async (req, res, next) => {
  try {
    const stats = await feeService.getFeeStats();
    res.json(stats);
  } catch (error) { next(error); }
};

const generatePaymentLink = async (req, res, next) => {
  try {
    const { feeAssignmentId } = req.params;
    const { sendVia = 'whatsapp', installmentIdx, paymentMethod } = req.body;
    const link = await feeService.generatePaymentLink(feeAssignmentId, sendVia, installmentIdx, paymentMethod);
    res.json({ message: 'Payment link generated', ...link });
  } catch (error) { next(error); }
};

const sendPaymentLink = async (req, res, next) => {
  try {
    const { feeAssignmentId } = req.params;
    const { sendVia = 'whatsapp' } = req.body;
    const result = await feeService.sendPaymentReminder(feeAssignmentId, sendVia);
    res.json({ message: 'Payment link sent', ...result });
  } catch (error) { next(error); }
};

const paymentCallback = async (req, res, next) => {
  try {
    const result = await feeService.handlePaymentCallback(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

module.exports = {
  createFeePlan, getFeePlans, getFeePlanById, updateFeePlan, deleteFeePlan,
  assignFeePlan, getStudentFees, getMyFees, getFeeAssignments,
  recordPayment, getPaymentHistory, getAllPayments, downloadReceipt, getFeeStats,
  generatePaymentLink, sendPaymentLink, paymentCallback,
};
