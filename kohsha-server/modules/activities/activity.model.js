const mongoose = require('mongoose');
const { ACTIVITY_TYPE } = require('../../config/constants');

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [String],
  notes: String,
  submittedAt: { type: Date, default: Date.now },
});

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  type: {
    type: String,
    enum: Object.values(ACTIVITY_TYPE),
    required: true,
  },
  className: { type: String, required: true },
  section: { type: String },
  dueDate: { type: Date },
  attachments: [String], // file paths
  submissions: [submissionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

activitySchema.index({ className: 1, section: 1 });
activitySchema.index({ type: 1 });
activitySchema.index({ dueDate: 1 });
activitySchema.index({ createdBy: 1 });
activitySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
