const zod = require('zod');
const { ANNOUNCEMENT_TYPE } = require('../../config/constants');

const createAnnouncementSchema = zod.object({
  body: zod.object({
    title: zod.string().min(1, 'Title is required').trim(),
    content: zod.string().min(1, 'Content is required'),
    type: zod.enum(Object.values(ANNOUNCEMENT_TYPE)).optional().default(ANNOUNCEMENT_TYPE.GENERAL),
    targetRoles: zod.array(zod.enum(['PARENT', 'TEACHER'])).optional().default([]),
    targetClasses: zod.array(zod.string()).optional().default([]),
    targetSections: zod.array(zod.string()).optional().default([]),
    sendViaWhatsApp: zod.boolean().optional().default(false),
    scheduledAt: zod.string().optional().nullable(),
    isPublished: zod.boolean().optional().default(true),
    attachments: zod.array(zod.string()).optional().default([]),
  }),
});

const updateAnnouncementSchema = zod.object({
  body: zod.object({
    title: zod.string().min(1, 'Title is required').trim().optional(),
    content: zod.string().min(1, 'Content is required').optional(),
    type: zod.enum(Object.values(ANNOUNCEMENT_TYPE)).optional(),
    targetRoles: zod.array(zod.enum(['PARENT', 'TEACHER'])).optional(),
    targetClasses: zod.array(zod.string()).optional(),
    targetSections: zod.array(zod.string()).optional(),
    sendViaWhatsApp: zod.boolean().optional(),
    scheduledAt: zod.string().optional().nullable(),
    isPublished: zod.boolean().optional(),
    attachments: zod.array(zod.string()).optional(),
  }),
});

module.exports = {
  createAnnouncementSchema,
  updateAnnouncementSchema,
};
