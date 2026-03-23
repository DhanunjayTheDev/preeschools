const mongoose = require('mongoose');
const { FEE_PLAN_TYPE, PAYMENT_STATUS } = require('../../config/constants');

// Fee Plan - template for a class
const feePlanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  className: { type: String, required: true },
  academicYear: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(FEE_PLAN_TYPE),
    required: true,
  },
  totalAmount: { type: Number, required: true },
  installments: [{
    label: String, // e.g., "Term 1", "January"
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
  }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

feePlanSchema.index({ className: 1, academicYear: 1 });

const FeePlan = mongoose.model('FeePlan', feePlanSchema);

// Fee Assignment - links a student to a fee plan with payment tracking
const feeAssignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feePlan: { type: mongoose.Schema.Types.ObjectId, ref: 'FeePlan', required: true },
  academicYear: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING,
  },
  schedule: [{
    label: String,
    amount: { type: Number, required: true },
    dueDate: Date,
    paidAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },
  }],
  discount: { type: Number, default: 0 },
  discountReason: String,
}, { timestamps: true });

feeAssignmentSchema.index({ student: 1 });
feeAssignmentSchema.index({ status: 1 });

const FeeAssignment = mongoose.model('FeeAssignment', feeAssignmentSchema);

// Payment transaction
const paymentSchema = new mongoose.Schema({
  feeAssignment: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeAssignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['CASH', 'UPI', 'CARD', 'BANK_TRANSFER', 'RAZORPAY'], default: 'CASH' },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'],
    default: 'SUCCESS',
  },
  receiptNumber: { type: String, unique: true },
  paidAt: { type: Date, default: Date.now },
  notes: String,
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

paymentSchema.index({ student: 1 });
paymentSchema.index({ feeAssignment: 1 });
paymentSchema.index({ paidAt: -1 });

// Auto-generate receipt number
paymentSchema.statics.generateReceiptNumber = async function () {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const count = await this.countDocuments();
  const seq = (count + 1).toString().padStart(5, '0');
  return `RCP${year}${month}${seq}`;
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = { FeePlan, FeeAssignment, Payment };
