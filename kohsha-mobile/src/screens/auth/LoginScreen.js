import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Input, Button } from '../../components/ui';
import useAuthStore from '../../stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    try {
      await login(email.trim().toLowerCase(), password);
    } catch {
      // Error is handled in store
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo / Header */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-2xl bg-primary-600 items-center justify-center mb-4 shadow-lg">
              <Ionicons name="school" size={40} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">Kohsha Academy</Text>
            <Text className="text-base text-gray-500 mt-1">Welcome back!</Text>
          </View>

          {/* Error message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex-row items-center">
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text className="text-red-600 text-sm ml-2 flex-1">{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Ionicons name="close" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}

          {/* Email input */}
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            icon="mail-outline"
            required
          />

          {/* Password input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">
              Password<Text className="text-red-500"> *</Text>
            </Text>
            <View className="relative">
              <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
                <Ionicons name="lock-closed-outline" size={18} color="#9ca3af" />
              </View>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-xl">
                <View className="flex-1">
                  <Input
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    containerClassName="mb-0"
                    className="border-0 pl-10"
                  />
                </View>
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="px-3">
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Login button */}
          <Button onPress={handleLogin} loading={loading} size="lg" className="shadow-md">
            Sign In
          </Button>

          {/* Info */}
          <View className="mt-6 items-center">
            <Text className="text-xs text-gray-400 text-center">
              For Parents & Teachers only.{'\n'}Contact admin for account setup.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
