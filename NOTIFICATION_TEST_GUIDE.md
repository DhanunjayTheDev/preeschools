# Notification Popup Testing Guide

## Issue: Notification popup not visible in dashboard

I've added comprehensive logging throughout the notification system. Follow these steps to test and debug:

### **Step 1: Ensure Backend is Running**
```bash
cd kohsha-server
npm start
# Should see logs like: 📝 Creating announcement, 🔔 Creating X notifications
```

### **Step 2: Open Browser DevTools**
- Press `F12` in your browser
- Go to **Console** tab
- Clear existing logs: `clear()`

### **Step 3: Login and Navigate**
1. Login as **TEACHER** (e.g., priya@example.com)
2. Go to **Dashboard** 
3. Watch browser console for:
   ```
   📬 Polling notifications: {...}   (every 3 seconds)
   ✅ First fetch - initialized...
   ```

### **Step 4: Create Announcement**
1. Open new tab → **Admin Dashboard**
2. Click **Announcement** button (or navigate to /dashboard/announcements)
3. Create new announcement with:
   - **Title**: Test Notification
   - **Content**: This is a test
   - **Type**: GENERAL
   - **Target Roles**: Select TEACHER (or PARENT)
   - Click **Create**

### **Step 5: Watch Browser Console**
Look for these log sequences:

**When announcement is created (Backend logs):**
```
📝 Creating announcement: {...}
✅ Announcement created: [ID]
🔍 Looking for users with filter: {isActive: true, role: ['TEACHER']}
👥 Found X target users: [{id, email, role}, ...]
🔔 Creating X notifications
✅ Notifications created successfully
```

**When dashboard polls (Browser console):**
```
📬 Polling notifications: {total: X, latest: "Test Notification", ...}
🔔 NEW NOTIFICATION DETECTED!
🎉 Found 1 new notification(s): ["Test Notification"]
📢 Triggering callback for: Test Notification
🎯 TeacherDashboard received notification callback: Test Notification
📌 Adding popup, total now: 1
🎨 NotificationPopup rendered: {title: "Test Notification", type: "ANNOUNCEMENT", ...}
```

### **Step 6: Expected Behavior**
- ✅ Notification POPUP appears in **bottom-right corner**
- ✅ Shows blue background with 📢 icon
- ✅ Shows notification title and message
- ✅ Auto-closes after 6 seconds OR click X to close
- ✅ Progress bar shrinks as it auto-closes

### **Troubleshooting Checklist**

#### If you see **"Found 0 target users"**:
- ❌ Teacher account not marked as ACTIVE
- **FIX**: Go to Users/Teachers in admin, check `isActive` checkbox

#### If you see **"No new notifications"** in browser console:
- ❌ Polling returning 0 notifications
- **FIX**: Check backend created notifications (check backend logs)
- Manually call API test:
  ```javascript
  // In browser console
  fetch('/api/notifications', {
    headers: { Authorization: `Bearer ${localStorage.getItem('kohsha_token')}` }
  }).then(r => r.json()).then(d => console.log('Notifications:', d))
  ```

#### If you see **"TeacherDashboard received notification callback"** but no popup:
- ❌ Popup component not rendering
- **FIX**: Check `displayedPopups` state isn't being cleared
- Try: `displayedPopups` should have length > 0

#### If popup appears but **hidden behind other elements**:
- ❌ Z-index conflict
- **FIX**: Already set to `zIndex: 9999` inline style
- Try: Press F12, inspect the popup element
- Check computed z-index value

---

## Step-by-Step Debugging Script

Paste this in your browser console to auto-test:

```javascript
// Step 1: Check if user is logged in
const token = localStorage.getItem('kohsha_token');
const user = JSON.parse(localStorage.getItem('kohsha_user'));
console.log('✅ Current user:', user);

// Step 2: Fetch notifications API
const response = await fetch('/api/notifications?limit=10', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
console.log('📬 Notifications API Response:', {
  total: data.notifications.length,
  unreadCount: data.unreadCount,
  firstNotif: data.notifications[0],
});

// Step 3: Check if first poll worked
console.log('📊 Check browser console for these logs every 3 seconds:');
console.log('   - "📬 Polling notifications:"');
console.log('   - "🔔 NEW NOTIFICATION DETECTED!" (after creating announcement)');
```

---

## Recent Fixes Applied

1. ✅ **Improved Notification Detection**:
   - Changed from date-based to ID-based tracking
   - Better logging to see every poll
   - Handles empty notifications gracefully

2. ✅ **Auto-refresh Progress Bar**:
   - Admin announcement details now refresh read stats every 2 seconds
   - Stats update in real-time as teachers view notifications

3. ✅ **Enhanced Logging**:
   - Added emoji prefixes to easily spot log messages
   - Backend and frontend logs now aligned
   - Console shows exact flow of notification creation → detection → display

---

## Quick Validation Checklist

- [ ] Backend logs show announcement created with notifications
- [ ] Browser console shows polling starting (3-second intervals)
- [ ] After creating announcement, browser shows "🔔 NEW NOTIFICATION DETECTED!"
- [ ] TeacherDashboard receives callback
- [ ] Popup renders with animation
- [ ] Popup visible in bottom-right corner
- [ ] Popup is blue with white icon/text
- [ ] Popup auto-closes after 6 seconds
- [ ] Admin's progress bar updates when you open notifications page

---

If stuck, share browser console logs + backend logs!
