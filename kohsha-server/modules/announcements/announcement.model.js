const mongoose = require('mongoose');
const { ANNOUNCEMENT_TYPE, ANNOUNCEMENT_DELIVERY } = require('../../config/constants');

const recipientStatusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: Object.values(ANNOUNCEMENT_DELIVERY),
    default: ANNOUNCEMENT_DELIVERY.SENT,
  },
  readAt: Date,
}, { _id: false });

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: Object.values(ANNOUNCEMENT_TYPE),
    default: ANNOUNCEMENT_TYPE.GENERAL,
  },
  // Targeting
  targetRoles: [{ type: String, enum: ['PARENT', 'TEACHER'] }],
  targetClasses: [String], // empty = all classes
  targetSections: [String],

  // Delivery
  recipients: [recipientStatusSchema],
  sendViaWhatsApp: { type: Boolean, default: false },
  whatsAppSent: { type: Boolean, default: false },

  // Scheduling
  scheduledAt: { type: Date },
  isPublished: { type: Boolean, default: true },

  // Attachments
  attachments: [{ type: String }],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

announcementSchema.index({ type: 1 });
announcementSchema.index({ isPublished: 1, scheduledAt: 1 });
announcementSchema.index({ targetRoles: 1 });
announcementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
