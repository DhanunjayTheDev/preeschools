const Razorpay = require('razorpay');
const { AppError } = require('../../middleware/errorHandler');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentLink = async ({ feeAssignmentId, studentId, studentName, amount, phone, email, description, options: methodOptions = {} }) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      accept_partial: false, // Specific installment — no partial
      reference_id: String(feeAssignmentId),
      description: description || `Tuition Fee - ${studentName}`,
      customer: {
        name: studentName,
      },
      customer_notify: 1,
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      notes: {
        studentId,
        studentName,
        feeAssignmentId,
      },
      callback_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/fees/payment/callback`,
      callback_method: 'get',
    };

    if (phone) options.customer.contact = phone;
    if (email) options.customer.email = email;

    // Restrict payment methods if specified
    if (methodOptions.method && Object.keys(methodOptions.method).length > 0) {
      options.options = {
        checkout: {
          method: {
            upi: 0, card: 0, netbanking: 0, wallet: 0,
            ...methodOptions.method,
          },
        },
      };
    }

    const paymentLink = await razorpay.paymentLink.create(options);
    return paymentLink;
  } catch (error) {
    throw new AppError(`Failed to create payment link: ${error.message}`, 500);
  }
};

const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const crypto = require('crypto');
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === razorpaySignature;
};

const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new AppError('Failed to fetch payment details', 500);
  }
};

module.exports = { createPaymentLink, verifyPaymentSignature, fetchPaymentDetails };
