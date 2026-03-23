#!/usr/bin/env node

/**
 * Manual Testing Script for Notification System
 * Run from kohsha-server directory: node test-notifications.js
 */

const mongoose = require('mongoose');
const path = require('path');

// Load models
const User = require('./modules/auth/user.model');
const Announcement = require('./modules/announcements/announcement.model');
const Notification = require('./modules/notifications/notification.model');
const db = require('./config/db');

async function testNotifications() {
  try {
    console.log('\n📋 Starting Notification System Test\n');

    // Connect to DB
    console.log('🔌 Connecting to database...');
    await db();
    console.log('✅ Connected\n');

    // 1. Find a teacher user
    console.log('👥 Looking for TEACHER users...');
    const teachers = await User.find({ role: 'TEACHER', isActive: true }).limit(3);
    if (teachers.length === 0) {
      console.log('❌ No active TEACHER users found!');
      console.log('   → Try: db.users.updateOne({role: "TEACHER"}, {isActive: true})\n');
      process.exit(1);
    }
    console.log(`✅ Found ${teachers.length} teachers:`, teachers.map(t => `${t.name} (${t.email})`), '\n');

    // 2. Create test announcement
    console.log('📝 Creating test announcement...');
    const announcement = await Announcement.create({
      title: '🧪 Test Notification - ' + new Date().toLocaleTimeString(),
      content: 'This is a test announcement at ' + new Date().toISOString(),
      type: 'GENERAL',
      targetRoles: ['TEACHER'],
      targetClasses: [],
      createdBy: teachers[0]._id,
      isPublished: true,
    });
    console.log(`✅ Created: ${announcement._id}\n`);

    // 3. Create notifications for all teachers
    console.log('🔔 Creating notifications for teachers...');
    const notifications = teachers.map(teacher => ({
      user: teacher._id,
      title: announcement.title,
      message: announcement.content.substring(0, 200),
      type: 'ANNOUNCEMENT',
      link: `/announcements/${announcement._id}`,
      metadata: { announcementId: announcement._id },
    }));
    
    const created = await Notification.insertMany(notifications);
    console.log(`✅ Created ${created.length} notifications\n`);

    // 4. Verify notifications exist for one teacher
    const teacherId = teachers[0]._id;
    console.log(`📬 Checking notifications for ${teachers[0].name}...`);
    const userNotifications = await Notification.find({ user: teacherId }).sort({ createdAt: -1 }).limit(5);
    console.log(`✅ User has ${userNotifications.length} notifications (latest 5 shown):`);
    userNotifications.forEach(n => {
      console.log(`   - ${n.title} (${n.isRead ? '📖 read' : '📬 unread'})`);
    });

    // 5. Verify recipients list
    console.log(`\n📊 Verifying recipients in announcement...`);
    const freshAnnouncement = await Announcement.findById(announcement._id).populate('recipients.user', 'name email');
    console.log(`✅ ${freshAnnouncement.recipients.length} total recipients`);
    freshAnnouncement.recipients.slice(0, 3).forEach(r => {
      console.log(`   - ${r.user.name} (${r.status})`);
    });

    console.log('\n✅ Test Complete!');
    console.log('\n📋 Now test the UI:');
    console.log('   1. Open browser console (F12)');
    console.log('   2. Login as ' + teachers[0].email);
    console.log('   3. Go to Teacher Dashboard');
    console.log('   4. Watch console for "🔔 NEW NOTIFICATION DETECTED!"');
    console.log('   5. Should see popup in bottom-right corner\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    console.error(err);
    process.exit(1);
  }
}

testNotifications();
