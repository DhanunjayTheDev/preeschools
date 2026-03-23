const { FeePlan, FeeAssignment, Payment } = require('./fee.model');
const Student = require('../students/student.model');
const { AppError } = require('../../middleware/errorHandler');
const PDFDocument = require('pdfkit');

// ---- Fee Plans ----
const createFeePlan = async (data, userId) => {
  return FeePlan.create({ ...data, createdBy: userId });
};

const getFeePlans = async ({ className, academicYear, isActive }) => {
  const filter = {};
  if (className) filter.className = className;
  if (academicYear) filter.academicYear = academicYear;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  return FeePlan.find(filter).sort({ className: 1 });
};

const getFeePlanById = async (id) => {
  const plan = await FeePlan.findById(id);
  if (!plan) throw new AppError('Fee plan not found', 404);
  return plan;
};

const updateFeePlan = async (id, data) => {
  const plan = await FeePlan.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!plan) throw new AppError('Fee plan not found', 404);
  return plan;
};

const deleteFeePlan = async (id) => {
  const assignments = await FeeAssignment.countDocuments({ feePlan: id });
  if (assignments > 0) throw new AppError('Cannot delete fee plan with active assignments', 400);
  const plan = await FeePlan.findByIdAndDelete(id);
  if (!plan) throw new AppError('Fee plan not found', 404);
  return plan;
};

// ---- Fee Assignments ----
const assignFeePlan = async (studentId, feePlanId) => {
  // Validate required fields
  if (!studentId || !feePlanId) {
    throw new AppError('Student ID and Fee Plan ID are required', 400);
  }

  // Validate ObjectId format
  if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError('Invalid student ID format', 400);
  }
  if (!feePlanId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError('Invalid fee plan ID format', 400);
  }

  const student = await Student.findById(studentId);
  if (!student) throw new AppError('Student not found', 404);
  const plan = await FeePlan.findById(feePlanId);
  if (!plan) throw new AppError('Fee plan not found', 404);

  const existing = await FeeAssignment.findOne({ student: studentId, feePlan: feePlanId });
  if (existing) throw new AppError('Fee plan already assigned to this student', 400);

  const schedule = plan.installments.map((inst) => ({
    label: inst.label,
    amount: inst.amount,
    dueDate: inst.dueDate,
    paidAmount: 0,
    status: 'PENDING',
  }));

  const assignment = await FeeAssignment.create({
    student: studentId,
    feePlan: feePlanId,
    academicYear: plan.academicYear,
    totalAmount: plan.totalAmount,
    dueAmount: plan.totalAmount,
    schedule,
  });

  student.feePlan = feePlanId;
  await student.save();
  return assignment;
};

const getStudentFees = async (studentId) => {
  return FeeAssignment.find({ student: studentId })
    .populate('feePlan')
    .populate('student', 'name studentId className section');
};

const getFeeAssignments = async ({ page = 1, limit = 20, status, className }) => {
  const pipeline = [
    { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'studentData' } },
    { $unwind: '$studentData' },
  ];
  const matchStage = {};
  if (status) matchStage.status = status;
  if (className) matchStage['studentData.className'] = className;
  if (Object.keys(matchStage).length > 0) pipeline.push({ $match: matchStage });

  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({ $skip: (Number(page) - 1) * Number(limit) });
  pipeline.push({ $limit: Number(limit) });

  const assignments = await FeeAssignment.aggregate(pipeline);
  const total = await FeeAssignment.countDocuments(status ? { status } : {});

  return {
    assignments,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  };
};

// ---- Payments ----
const recordPayment = async (data, userId) => {
  const assignment = await FeeAssignment.findById(data.feeAssignmentId);
  if (!assignment) throw new AppError('Fee assignment not found', 404);

  const receiptNumber = await Payment.generateReceiptNumber();
  const payment = await Payment.create({
    feeAssignment: assignment._id,
    student: assignment.student,
    amount: data.amount,
    method: data.method || 'CASH',
    notes: data.notes,
    collectedBy: userId,
    receiptNumber,
    razorpayOrderId: data.razorpayOrderId,
    razorpayPaymentId: data.razorpayPaymentId,
    razorpaySignature: data.razorpaySignature,
  });

  // Update assignment
  assignment.paidAmount += data.amount;
  assignment.dueAmount = assignment.totalAmount - assignment.paidAmount;
  if (assignment.dueAmount <= 0) {
    assignment.status = 'PAID';
    assignment.dueAmount = 0;
  } else {
    assignment.status = 'PARTIAL';
  }

  // Update schedule installments
  let remaining = data.amount;
  for (const inst of assignment.schedule) {
    if (remaining <= 0) break;
    if (inst.status === 'PAID') continue;
    const due = inst.amount - inst.paidAmount;
    if (due > 0) {
      const pay = Math.min(remaining, due);
      inst.paidAmount += pay;
      remaining -= pay;
      inst.status = inst.paidAmount >= inst.amount ? 'PAID' : 'PARTIAL';
    }
  }

  await assignment.save();
  return { payment, assignment };
};

const getPaymentHistory = async (studentId, { page = 1, limit = 20 }) => {
  const filter = studentId ? { student: studentId } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate('student', 'name studentId')
      .populate('collectedBy', 'name')
      .sort({ paidAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Payment.countDocuments(filter),
  ]);
  return { payments, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } };
};

const generateReceipt = (payment, student) => {
  const doc = new PDFDocument({ margin: 50, size: 'A5' });

  doc.fontSize(18).font('Helvetica-Bold').text('Kohsha Academy', { align: 'center' });
  doc.fontSize(10).font('Helvetica').text('Payment Receipt', { align: 'center' });
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(370, doc.y).stroke();
  doc.moveDown();

  const details = [
    ['Receipt No', payment.receiptNumber],
    ['Date', new Date(payment.paidAt).toLocaleDateString('en-IN')],
    ['Student', student.name],
    ['Student ID', student.studentId],
    ['Class', `${student.className} - ${student.section}`],
    ['Amount', `₹${payment.amount.toLocaleString('en-IN')}`],
    ['Method', payment.method],
    ['Status', payment.status],
  ];

  details.forEach(([label, value]) => {
    doc.fontSize(10).font('Helvetica-Bold').text(`${label}: `, { continued: true });
    doc.font('Helvetica').text(value);
  });

  doc.moveDown(2);
  doc.moveTo(50, doc.y).lineTo(370, doc.y).stroke();
  doc.moveDown();
  doc.fontSize(8).text('This is a computer-generated receipt.', { align: 'center' });

  return doc;
};

const getFeeStats = async () => {
  const totalCollected = await Payment.aggregate([
    { $match: { status: 'SUCCESS' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalDue = await FeeAssignment.aggregate([
    { $group: { _id: null, total: { $sum: '$dueAmount' } } },
  ]);
  const overdue = await FeeAssignment.countDocuments({ status: { $in: ['PENDING', 'PARTIAL'] } });

  return {
    totalCollected: totalCollected[0]?.total || 0,
    totalDue: totalDue[0]?.total || 0,
    overdueCount: overdue,
  };
};

// ---- Payment Links (Razorpay) ----
const PAYMENT_METHOD_CHARGES = {
  upi_bank:      0.02,
  upi_credit:    0.035,
  card_india:    0.02,
  international: 0.03,
  netbanking:    0.02,
  wallet:        0.02,
};

// Razorpay method keys: upi, card, netbanking, wallet
const RAZORPAY_METHOD_MAP = {
  upi_bank:      { upi: 1 },
  upi_credit:    { upi: 1 },
  card_india:    { card: 1 },
  international: { card: 1 },
  netbanking:    { netbanking: 1 },
  wallet:        { wallet: 1 },
};

const generatePaymentLink = async (feeAssignmentId, sendVia = 'whatsapp', installmentIdx = null, paymentMethod = null) => {
  const razorpayService = require('./razorpay.service');
  const messagingService = require('../notifications/messaging.service');

  const assignment = await FeeAssignment.findById(feeAssignmentId).populate('student');
  if (!assignment) throw new AppError('Fee assignment not found', 404);

  const student = assignment.student;

  // Determine which installment / base amount
  let baseAmount = assignment.dueAmount;
  let installmentLabel = null;
  let instDueDate = null;
  if (installmentIdx !== null && installmentIdx !== undefined && assignment.schedule?.[installmentIdx]) {
    const inst = assignment.schedule[installmentIdx];
    baseAmount = inst.amount - (inst.paidAmount || 0);
    installmentLabel = inst.label;
    instDueDate = inst.dueDate;
  }

  // Calculate final amount including processing charges + 18% GST on charges
  let finalAmount = baseAmount;
  if (paymentMethod && PAYMENT_METHOD_CHARGES[paymentMethod]) {
    const chargeRate = PAYMENT_METHOD_CHARGES[paymentMethod];
    const charges = Math.ceil(baseAmount * chargeRate);
    const gst = Math.ceil(charges * 0.18);
    finalAmount = baseAmount + charges + gst;
  }

  // Build Razorpay options to restrict payment method
  const razorpayOptions = paymentMethod && RAZORPAY_METHOD_MAP[paymentMethod]
    ? { method: RAZORPAY_METHOD_MAP[paymentMethod] }
    : {};

  // Generate Razorpay payment link
  const paymentLink = await razorpayService.createPaymentLink({
    feeAssignmentId: assignment._id,
    studentId: student._id,
    studentName: student.name,
    amount: finalAmount,
    phone: student.fatherPhone || student.motherPhone,
    email: student.fatherEmail || student.motherEmail,
    description: installmentLabel
      ? `${installmentLabel} fee for ${student.name}`
      : `Fee payment for ${student.name}`,
    options: razorpayOptions,
  });

  // Send payment reminder via WhatsApp/SMS
  const phoneNumber = student.fatherPhone || student.motherPhone;
  if (phoneNumber && (sendVia === 'whatsapp' || sendVia === 'both' || sendVia === 'sms')) {
    const dueDate = instDueDate
      || assignment.schedule.find(s => s.status !== 'PAID')?.dueDate
      || new Date();
    const results = await messagingService.sendPaymentReminder({
      recipientPhone: phoneNumber,
      studentName: student.name,
      amount: finalAmount,
      paymentLink: paymentLink.short_url,
      dueDate,
      method: sendVia,
    });

    return {
      paymentLink,
      messagingResults: results,
      status: 'Payment link created and sent',
    };
  }

  return {
    paymentLink,
    status: 'Payment link created (no phone number to send)',
  };
};

const sendPaymentReminder = async (feeAssignmentId, sendVia = 'whatsapp') => {
  const messagingService = require('../notifications/messaging.service');
  
  const assignment = await FeeAssignment.findById(feeAssignmentId).populate('student');
  if (!assignment) throw new AppError('Fee assignment not found', 404);
  
  const student = assignment.student;
  const phoneNumber = student.fatherPhone || student.motherPhone;
  
  if (!phoneNumber) throw new AppError('No phone number available to send reminder', 400);
  
  // Get existing payment link (for simplicity, generate a new one)
  const razorpayService = require('./razorpay.service');
  const paymentLink = await razorpayService.createPaymentLink({
    feeAssignmentId: assignment._id,
    studentId: student._id,
    studentName: student.name,
    amount: assignment.dueAmount,
    phone: phoneNumber,
    email: student.fatherEmail || student.motherEmail,
  });
  
  const dueDate = assignment.schedule.find(s => s.status !== 'PAID')?.dueDate || new Date();
  const results = await messagingService.sendPaymentReminder({
    recipientPhone: phoneNumber,
    studentName: student.name,
    amount: assignment.dueAmount,
    paymentLink: paymentLink.short_url,
    dueDate,
    method: sendVia,
  });
  
  return {
    paymentLink,
    messagingResults: results,
    status: 'Reminder sent successfully',
  };
};

const handlePaymentCallback = async (query) => {
  // Handle Razorpay payment callback
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = query;
  const razorpayService = require('./razorpay.service');
  
  // Find assignment by reference_id (feeAssignmentId stored in payment link)
  const payment = await Payment.findOne({ razorpayPaymentId: razorpay_payment_id });
  
  if (payment) {
    return { message: 'Payment already recorded', payment };
  }
  
  // Fetch payment details from Razorpay
  const paymentDetails = await razorpayService.fetchPaymentDetails(razorpay_payment_id);
  
  if (paymentDetails.status === 'captured' || paymentDetails.status === 'authorized') {
    // Payment successful - record it
    const result = await recordPayment({
      feeAssignmentId: paymentDetails.notes?.feeAssignmentId,
      amount: paymentDetails.amount / 100,
      method: 'RAZORPAY',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature,
    });
    
    return { message: 'Payment processed successfully', result };
  }
  
  return { message: 'Payment not captured', status: paymentDetails.status };
};

module.exports = {
  createFeePlan, getFeePlans, getFeePlanById, updateFeePlan, deleteFeePlan,
  assignFeePlan, getStudentFees, getFeeAssignments,
  recordPayment, getPaymentHistory, generateReceipt, getFeeStats,
  generatePaymentLink, sendPaymentReminder, handlePaymentCallback,
};
