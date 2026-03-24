import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { login, loading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }
    try { 
      await login(email.trim().toLowerCase(), password); 
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f7ff' }} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f7ff" />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        {/* Header Section */}
        <View style={{ paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, alignItems: 'center' }}>
          <View style={{ width: 80, height: 80, borderRadius: 24, backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#7c3aed', shadowOpacity: 0.4, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 8 }}>
            <Ionicons name="school" size={40} color="#fff" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#1f2937' }}>Kohsha Academy</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Parent & Teacher Portal</Text>
        </View>

        {/* Form Section */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
          
          {/* Error Message */}
          {error && (
            <View style={{ backgroundColor: '#fee2e2', borderLeftWidth: 4, borderLeftColor: '#ef4444', borderRadius: 12, padding: 14, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="alert-circle" size={20} color="#ef4444" />
              <Text style={{ flex: 1, color: '#dc2626', fontSize: 13, marginLeft: 10, fontWeight: '500' }}>{error}</Text>
              <TouchableOpacity onPress={clearError} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}

          {/* Email Input */}
          <View style={{ marginBottom: 18 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Email Address</Text>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              borderWidth: 1.5, 
              borderRadius: 16, 
              paddingHorizontal: 16, 
              backgroundColor: '#fff',
              borderColor: emailFocused ? '#7c3aed' : '#e5e7eb',
              height: 54
            }}>
              <Ionicons name="mail-outline" size={20} color={emailFocused ? '#7c3aed' : '#9ca3af'} />
              <TextInput
                style={{ 
                  flex: 1, 
                  fontSize: 15, 
                  color: '#1f2937', 
                  marginLeft: 12,
                  padding: 0
                }}
                placeholder="your@email.com"
                placeholderTextColor="#d1d5db"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={true}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Password</Text>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              borderWidth: 1.5, 
              borderRadius: 16, 
              paddingHorizontal: 16, 
              backgroundColor: '#fff',
              borderColor: passwordFocused ? '#7c3aed' : '#e5e7eb',
              height: 54
            }}>
              <Ionicons name="lock-closed-outline" size={20} color={passwordFocused ? '#7c3aed' : '#9ca3af'} />
              <TextInput
                style={{ 
                  flex: 1, 
                  fontSize: 15, 
                  color: '#1f2937', 
                  marginLeft: 12,
                  padding: 0
                }}
                placeholder="Enter your password"
                placeholderTextColor="#d1d5db"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                editable={true}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons 
                  name={showPassword ? 'eye' : 'eye-off'} 
                  size={20} 
                  color={passwordFocused ? '#7c3aed' : '#9ca3af'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
            style={{ 
              backgroundColor: loading ? '#d8b4fe' : '#7c3aed', 
              borderRadius: 16, 
              height: 54,
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'row',
              shadowColor: '#7c3aed', 
              shadowOpacity: 0.35, 
              shadowRadius: 10, 
              shadowOffset: { width: 0, height: 4 },
              elevation: 5
            }}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="sync" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Signing in...</Text>
              </View>
            ) : (
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Info Text */}
          <View style={{ marginTop: 28, paddingHorizontal: 12 }}>
            <Text style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', lineHeight: 18 }}>
              For Parents & Teachers only. Contact admin for account access.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
