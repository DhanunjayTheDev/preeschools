require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./modules/auth/auth.routes');
const enquiryRoutes = require('./modules/enquiries/enquiry.routes');
const studentRoutes = require('./modules/students/student.routes');
const feeRoutes = require('./modules/fees/fee.routes');
const announcementRoutes = require('./modules/announcements/announcement.routes');
const activityRoutes = require('./modules/activities/activity.routes');
const calendarRoutes = require('./modules/calendar/calendar.routes');
const userRoutes = require('./modules/users/user.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const teacherRegistrationRoutes = require('./modules/teacher-registrations/teacherRegistration.routes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration for multiple origins
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:5173',
      process.env.ADMIN_URL || 'http://localhost:3001',
      ...(process.env.MOBILE_APP_URL === '*' ? ['*'] : process.env.MOBILE_APP_URL?.split(',') || []),
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later' },
  skip: (req) => req.path === '/auth/login', // Skip login endpoint
});

app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/teacher-registrations', teacherRegistrationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Kohsha Academy Server running on port ${PORT}`);
  });
});

module.exports = app;
