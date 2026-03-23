const mongoose = require('mongoose');
const { CALENDAR_EVENT_TYPE } = require('../../config/constants');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  type: {
    type: String,
    enum: Object.values(CALENDAR_EVENT_TYPE),
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isAllDay: { type: Boolean, default: true },
  isRecurring: { type: Boolean, default: false },
  recurrenceRule: { type: String }, // e.g., "YEARLY"
  targetClasses: [String], // empty = all
  color: { type: String, default: '#3B82F6' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

calendarEventSchema.index({ startDate: 1, endDate: 1 });
calendarEventSchema.index({ type: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
