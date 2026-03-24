import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../stores/authStore';

function InfoRow({ icon, label, value, isEditing = false, onChangeText = null }) {
  if (!isEditing && !value) return null;
  
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
      {isEditing ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 14, height: 48 }}>
          <Ionicons name={icon} size={18} color="#9ca3af" style={{ marginRight: 10 }} />
          <TextInput 
            value={value} 
            onChangeText={onChangeText}
            style={{ flex: 1, fontSize: 15, color: '#1f2937' }}
            placeholderTextColor="#d1d5db"
          />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#f3f4f6' }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: '#e5e7eb' }}>
            <Ionicons name={icon} size={16} color="#7c3aed" />
          </View>
          <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '500' }}>{value || 'Not set'}</Text>
        </View>
      )}
    </View>
  );
}

export default function ProfileScreen() {
  const { user, updateProfile, changePassword, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Validation', 'Name is required'); return; }
    setSaving(true);
    try {
      await updateProfile({ name, phone });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      Alert.alert('Validation', 'Please fill all password fields'); return;
    }
    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Validation', 'New password must be at least 6 characters'); return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Validation', 'Passwords do not match'); return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      Alert.alert('Success', 'Password changed successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to change password');
    } finally { setChangingPassword(false); }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const heroColor = user?.role === 'TEACHER' ? '#2563eb' : '#7c3aed';
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: heroColor }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={heroColor} />

      {/* Hero Section */}
      <View style={{ backgroundColor: heroColor, paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <View style={{ position: 'absolute', bottom: -20, left: -50, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        
        <View style={{ alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#fff' }}>{initials}</Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 }}>{user?.name}</Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>{user?.email}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }}>
            <Ionicons name={user?.role === 'TEACHER' ? 'briefcase' : 'people'} size={14} color="#fff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 }}>{user?.role}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: heroColor + '15', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name="person" size={20} color={heroColor} />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>Profile Information</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                if (editing) {
                  handleSave();
                } else {
                  setEditing(true);
                }
              }}
              style={{ backgroundColor: editing ? heroColor : '#f3f4f6', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: editing ? '#fff' : heroColor }}>
                {editing ? (saving ? 'Saving...' : 'Save') : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {editing ? (
            <View>
              <InfoRow icon="person-outline" label="Full Name" isEditing={true} value={name} onChangeText={setName} />
              <InfoRow icon="call-outline" label="Phone" isEditing={true} value={phone} onChangeText={setPhone} />
              <TouchableOpacity onPress={() => {
                setEditing(false);
                setName(user?.name || '');
                setPhone(user?.phone || '');
              }} style={{ marginTop: 12 }}>
                <Text style={{ color: '#9ca3af', fontSize: 14, fontWeight: '500', textAlign: 'center' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <InfoRow icon="person-outline" label="Full Name" value={user?.name} />
              <InfoRow icon="mail-outline" label="Email Address" value={user?.email} />
              <InfoRow icon="call-outline" label="Phone Number" value={user?.phone} />
            </View>
          )}
        </View>

        {/* Change Password Card */}
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
          <TouchableOpacity 
            onPress={() => setShowPasswordForm(!showPasswordForm)} 
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Ionicons name="lock-closed-outline" size={20} color="#ca8a04" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>Change Password</Text>
            </View>
            <Ionicons name={showPasswordForm ? 'chevron-up' : 'chevron-down'} size={22} color="#9ca3af" />
          </TouchableOpacity>

          {showPasswordForm && (
            <View style={{ marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' }}>
              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Current Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 14, height: 48 }}>
                  <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    value={passwordForm.currentPassword}
                    onChangeText={t => setPasswordForm({ ...passwordForm, currentPassword: t })}
                    secureTextEntry
                    placeholder="Enter current password"
                    placeholderTextColor="#d1d5db"
                    style={{ flex: 1, fontSize: 15, color: '#1f2937' }}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>New Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 14, height: 48 }}>
                  <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    value={passwordForm.newPassword}
                    onChangeText={t => setPasswordForm({ ...passwordForm, newPassword: t })}
                    secureTextEntry
                    placeholder="Min 6 characters"
                    placeholderTextColor="#d1d5db"
                    style={{ flex: 1, fontSize: 15, color: '#1f2937' }}
                  />
                </View>
              </View>

              <View style={{ marginBottom: 18 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirm Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 14, height: 48 }}>
                  <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    value={passwordForm.confirmPassword}
                    onChangeText={t => setPasswordForm({ ...passwordForm, confirmPassword: t })}
                    secureTextEntry
                    placeholder="Re-enter new password"
                    placeholderTextColor="#d1d5db"
                    style={{ flex: 1, fontSize: 15, color: '#1f2937' }}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={handleChangePassword}
                disabled={changingPassword}
                style={{ backgroundColor: '#ca8a04', borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
              >
                {changingPassword ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="sync" size={16} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Updating...</Text>
                  </View>
                ) : (
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Logout Card */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fee2e2', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, marginBottom: 24 }}
        >
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ef4444' }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

