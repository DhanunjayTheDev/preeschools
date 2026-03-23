import { useEffect, useState } from 'react';
import useAuthStore from '../stores/authStore';
import { Button, Modal, Input } from '../components/ui';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineLock } from 'react-icons/ai';
import toast from 'react-hot-toast';
import { formatDate } from '../lib/utils';

export default function Profile() {
  const { user, fetchProfile, updateProfile, changePassword, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(editForm);
      toast.success('Profile updated successfully');
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required';
    if (passwordForm.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrent: false,
        showNew: false,
        showConfirm: false,
      });
      setPasswordErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
      setPasswordErrors({ submit: err.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  const roleColors = {
    SUPER_ADMIN: 'bg-red-100 text-red-800',
    ADMIN: 'bg-orange-100 text-orange-800',
    TEACHER: 'bg-blue-100 text-blue-800',
    PARENT: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <div className="text-5xl">{user.name?.charAt(0) || '👤'}</div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${roleColors[user.role] || 'bg-gray-100 text-gray-800'}`}>
                  {user.role?.replace(/_/g, ' ')}
                </span>
                {user.isActive && <span className="px-4 py-1 rounded-full text-sm font-semibold bg-green-500/30 text-green-100">🟢 Active</span>}
              </div>
              <p className="text-blue-100">Last login: {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowEditModal(true)} className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              ✏️ Edit Profile
            </Button>
            <Button variant="secondary" onClick={() => setShowPasswordModal(true)} className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
              🔐 Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">📧</span>Contact Information
          </h2>
          <div className="space-y-5">
            <div className="pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
              <p className="text-gray-900 font-semibold">{user.email}</p>
            </div>
            <div className="pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Phone Number</p>
              <p className="text-gray-900 font-semibold">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Account Status</p>
              <p className="text-gray-900 font-semibold flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">🛡️</span>Account Information
          </h2>
          <div className="space-y-5">
            <div className="pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Account Type</p>
              <p className="text-gray-900 font-semibold">{user.role?.replace(/_/g, ' ') || 'User'}</p>
            </div>
            <div className="pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500 font-medium mb-1">Member Since</p>
              <p className="text-gray-900 font-semibold">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Last Login</p>
              <p className="text-gray-900 font-semibold">{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
            </div>
          </div>
        </div>

        {/* Teacher-Specific Info */}
        {user.role === 'TEACHER' && user.assignedClasses && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">👨‍🏫</span>Assigned Classes
            </h2>
            {user.assignedClasses.length > 0 ? (
              <div className="space-y-3">
                {user.assignedClasses.map((cls, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-lg">📚</span>
                    <span className="text-gray-900 font-semibold">
                      {cls.className} - Section {cls.section}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No classes assigned yet</p>
            )}
          </div>
        )}

        {/* Parent-Specific Info */}
        {user.role === 'PARENT' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-2xl mr-3">👶</span>Children
            </h2>
            {user.children && user.children.length > 0 ? (
              <div className="space-y-3">
                {user.children.map((child, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-lg">👧</span>
                    <span className="text-gray-900 font-semibold">{child.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No children added yet</p>
            )}
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        <Button
          variant="danger"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="px-6"
        >
          🚪 Logout
        </Button>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-profile-form" className="bg-gradient-to-r from-blue-600 to-indigo-600">
              Save Changes
            </Button>
          </>
        }
      >
        <form id="edit-profile-form" onSubmit={handleEditSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
              <span className="text-lg mr-2">ℹ️</span>Personal Information
            </h4>
            <div className="space-y-4">
              <Input
                label="Full Name *"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
                placeholder="Enter your full name"
              />
              <Input
                label="Phone Number"
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            showCurrent: false,
            showNew: false,
            showConfirm: false,
          });
          setPasswordErrors({});
        }}
        title="Change Password"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" form="change-password-form" loading={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600">
              Change Password
            </Button>
          </>
        }
      >
        <form id="change-password-form" onSubmit={handlePasswordSubmit} className="space-y-6">
          {/* Error Message */}
          {passwordErrors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700 flex items-start">
                <span className="mr-2">⚠️</span>
                <span>{passwordErrors.submit}</span>
              </p>
            </div>
          )}

          {/* Password Fields */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password *</label>
              <div className="relative">
                <AiOutlineLock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={passwordForm.showCurrent ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                    if (passwordErrors.currentPassword) setPasswordErrors({ ...passwordErrors, currentPassword: '' });
                  }}
                  placeholder="Enter current password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    passwordErrors.currentPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordForm({ ...passwordForm, showCurrent: !passwordForm.showCurrent })}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {passwordForm.showCurrent ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.currentPassword && <p className="mt-2 text-sm text-red-600">⚠️ {passwordErrors.currentPassword}</p>}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
              <div className="relative">
                <AiOutlineLock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={passwordForm.showNew ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                    if (passwordErrors.newPassword) setPasswordErrors({ ...passwordErrors, newPassword: '' });
                  }}
                  placeholder="Enter new password (min 6 characters)"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    passwordErrors.newPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordForm({ ...passwordForm, showNew: !passwordForm.showNew })}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {passwordForm.showNew ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && <p className="mt-2 text-sm text-red-600">⚠️ {passwordErrors.newPassword}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password *</label>
              <div className="relative">
                <AiOutlineLock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type={passwordForm.showConfirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                    if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: '' });
                  }}
                  placeholder="Confirm new password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    passwordErrors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setPasswordForm({ ...passwordForm, showConfirm: !passwordForm.showConfirm })}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {passwordForm.showConfirm ? <AiOutlineEyeInvisible className="w-5 h-5" /> : <AiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && <p className="mt-2 text-sm text-red-600">⚠️ {passwordErrors.confirmPassword}</p>}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">📋 Password Requirements:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Minimum 6 characters</li>
              <li>✓ New password must be different from current password</li>
              <li>✓ Passwords must match</li>
            </ul>
          </div>
        </form>
      </Modal>
    </div>
  );
}
