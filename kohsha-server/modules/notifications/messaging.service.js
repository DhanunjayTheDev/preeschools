const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsAppPaymentLink = async ({ recipientPhone, studentName, amount, paymentLink, dueDate }) => {
  try {
    const message = `Hello! 👋\n\n`
      + `Payment reminder for *${studentName}*\n\n`
      + `🏫 *Amount:* ₹${amount.toLocaleString('en-IN')}\n`
      + `📅 *Due Date:* ${new Date(dueDate).toLocaleDateString('en-IN')}\n`
      + `🔗 *Pay Now:* ${paymentLink}\n\n`
      + `Thank you! - Kohsha Academy`;

    const result = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${recipientPhone}`,
      body: message,
    });

    return { success: true, messageId: result.sid, status: 'sent' };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return { success: false, error: error.message };
  }
};

const sendSMSPaymentLink = async ({ recipientPhone, studentName, amount, paymentLink }) => {
  try {
    const message = `Kohsha Academy - Payment reminder for ${studentName}. Amount: ₹${amount}. Pay via: ${paymentLink}`;

    const result = await client.messages.create({
      from: process.env.TWILIO_SMS_NUMBER,
      to: recipientPhone,
      body: message,
    });

    return { success: true, messageId: result.sid, status: 'sent' };
  } catch (error) {
    console.error('SMS send error:', error);
    return { success: false, error: error.message };
  }
};

const sendPaymentReminder = async ({ recipientPhone, recipientEmail, studentName, amount, paymentLink, dueDate, method = 'both' }) => {
  const results = {};

  if (method === 'whatsapp' || method === 'both') {
    if (recipientPhone) {
      results.whatsapp = await sendWhatsAppPaymentLink({ recipientPhone, studentName, amount, paymentLink, dueDate });
    }
  }

  if (method === 'sms' || method === 'both') {
    if (recipientPhone) {
      results.sms = await sendSMSPaymentLink({ recipientPhone, studentName, amount, paymentLink });
    }
  }

  return results;
};

module.exports = { sendWhatsAppPaymentLink, sendSMSPaymentLink, sendPaymentReminder };
