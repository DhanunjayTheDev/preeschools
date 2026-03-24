import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Button, Input, Divider } from '../../components/ui';
import useAuthStore from '../../stores/authStore';

const InfoRow = ({ icon, label, value }) => (
  <View className="flex-row items-center py-2.5">
    <View className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center mr-3">
      <Ionicons name={icon} size={16} color="#6b7280" />
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-400">{label}</Text>
      <Text className="text-sm text-gray-900">{value || '—'}</Text>
    </View>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const { user, updateProfile, changePassword, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name is required');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      setEditing(false);
      Alert.alert('Success', 'Profile updated');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      Alert.alert('Validation', 'Both fields are required');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Validation', 'New password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setShowPassword(false);
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Screen scroll>
      <View className="px-5 pt-4 pb-6">
        {/* Profile Header */}
        <View className="items-center mb-6">
          <Avatar name={user?.name} size="xl" />
          <Text className="text-xl font-bold text-gray-900 mt-3">{user?.name}</Text>
          <Text className="text-sm text-gray-500">{user?.email}</Text>
          <View className="bg-primary-50 px-3 py-1 rounded-full mt-2">
            <Text className="text-xs font-medium text-primary-700 capitalize">{user?.role}</Text>
          </View>
        </View>

        {/* Profile Info */}
        <Card className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-gray-900">Profile Info</Text>
            <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
              <Text className="text-sm text-primary-600 font-medium">{editing ? (saving ? 'Saving...' : 'Save') : 'Edit'}</Text>
            </TouchableOpacity>
          </View>
          {editing ? (
            <>
              <Input label="Name" value={name} onChangeText={setName} required />
              <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <Button variant="ghost" size="sm" onPress={() => setEditing(false)} className="mt-1">Cancel</Button>
            </>
          ) : (
            <>
              <InfoRow icon="person-outline" label="Name" value={user?.name} />
              <InfoRow icon="mail-outline" label="Email" value={user?.email} />
              <InfoRow icon="call-outline" label="Phone" value={user?.phone} />
              <InfoRow icon="shield-outline" label="Role" value={user?.role} />
            </>
          )}
        </Card>

        {/* Change Password */}
        <Card className="mb-4">
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-900">Change Password</Text>
            <Ionicons name={showPassword ? 'chevron-up' : 'chevron-down'} size={20} color="#6b7280" />
          </TouchableOpacity>
          {showPassword && (
            <View className="mt-3">
              <Input
                label="Current Password"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChangeText={(t) => setPasswordForm({ ...passwordForm, currentPassword: t })}
                secureTextEntry
                required
              />
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChangeText={(t) => setPasswordForm({ ...passwordForm, newPassword: t })}
                secureTextEntry
                required
              />
              <Button onPress={handleChangePassword} loading={changingPassword} size="sm" className="mt-2">
                Change Password
              </Button>
            </View>
          )}
        </Card>

        <Divider className="my-2" />

        <Button variant="ghost" onPress={handleLogout} className="mt-2">
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text className="text-red-500 font-medium ml-2">Logout</Text>
          </View>
        </Button>
      </View>
    </Screen>
  );
}
