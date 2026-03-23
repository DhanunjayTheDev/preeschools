import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './stores/authStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Enquiries from './pages/admin/Enquiries';
import EnquiryDetail from './pages/admin/EnquiryDetail';
import Students from './pages/admin/Students';
import Fees from './pages/admin/Fees';
import AdminAnnouncements from './pages/admin/Announcements';
import AdminActivities from './pages/admin/Activities';
import AdminCalendar from './pages/admin/Calendar';
import Teachers from './pages/admin/Teachers';
import TeacherRegistrations from './pages/admin/TeacherRegistrations';
import Users from './pages/admin/Users';
import AdminNotifications from './pages/admin/Notifications';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherActivities from './pages/teacher/Activities';
import TeacherStudents from './pages/teacher/Students';
import Attendance from './pages/teacher/Attendance';
import TeacherNotifications from './pages/teacher/Notifications';

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard';
import ParentActivities from './pages/parent/Activities';
import ParentAnnouncements from './pages/parent/Announcements';
import ParentFees from './pages/parent/Fees';
import ParentCalendar from './pages/parent/Calendar';
import ParentNotifications from './pages/parent/Notifications';

function HomeRedirect() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'TEACHER') return <Navigate to="/teacher" replace />;
  if (user.role === 'PARENT') return <Navigate to="/parent" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeRedirect />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}><Layout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="enquiries/:id" element={<EnquiryDetail />} />
          <Route path="students" element={<Students />} />
          <Route path="fees" element={<Fees />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="activities" element={<AdminActivities />} />
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teacher-applications" element={<TeacherRegistrations />} />
          <Route path="users" element={<Users />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute roles={['TEACHER']}><Layout /></ProtectedRoute>}>
          <Route index element={<TeacherDashboard />} />
          <Route path="activities" element={<TeacherActivities />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="notifications" element={<TeacherNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Parent Routes */}
        <Route path="/parent" element={<ProtectedRoute roles={['PARENT']}><Layout /></ProtectedRoute>}>
          <Route index element={<ParentDashboard />} />
          <Route path="activities" element={<ParentActivities />} />
          <Route path="announcements" element={<ParentAnnouncements />} />
          <Route path="fees" element={<ParentFees />} />
          <Route path="calendar" element={<ParentCalendar />} />
          <Route path="notifications" element={<ParentNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
