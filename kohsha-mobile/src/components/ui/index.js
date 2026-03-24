import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView as RNScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Screen wrapper with safe area
export function Screen({ children, className = '', scroll = false, refreshing, onRefresh, ...props }) {
  if (scroll) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <RNScrollView
          className={`flex-1 ${className}`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" colors={['#7c3aed']} />
            ) : undefined
          }
          {...props}
        >
          {children}
        </RNScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className={`flex-1 bg-gray-50 ${className}`} edges={['top']} {...props}>
      {children}
    </SafeAreaView>
  );
}

// Button component
export function Button({ children, onPress, variant = 'primary', size = 'md', loading = false, disabled = false, icon, className = '', textClassName = '' }) {
  const baseClasses = 'flex-row items-center justify-center rounded-xl';
  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-5 py-3',
    lg: 'px-6 py-4',
  };
  const variantClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-100 border border-gray-200',
    danger: 'bg-red-500',
    ghost: 'bg-transparent',
    outline: 'bg-transparent border-2 border-primary-600',
  };
  const textVariantClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-gray-700 font-medium',
    danger: 'text-white font-semibold',
    ghost: 'text-primary-600 font-medium',
    outline: 'text-primary-600 font-semibold',
  };
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50' : ''} ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#7c3aed'} size="small" />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={variant === 'primary' || variant === 'danger' ? '#fff' : '#7c3aed'} style={{ marginRight: 6 }} />}
          <Text className={`${textVariantClasses[variant]} ${textSizeClasses[size]} ${textClassName}`}>{children}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// Input component
export function Input({ label, error, required, icon, className = '', containerClassName = '', ...props }) {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      <View className="relative">
        {icon && (
          <View className="absolute left-3 top-0 bottom-0 justify-center z-10">
            <Ionicons name={icon} size={18} color="#9ca3af" />
          </View>
        )}
        <TextInput
          className={`bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 ${icon ? 'pl-10' : ''} ${error ? 'border-red-400' : 'focus:border-primary-500'} ${className}`}
          placeholderTextColor="#9ca3af"
          {...props}
        />
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}

// Card component
export function Card({ children, className = '', onPress, ...props }) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} activeOpacity={0.7} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`} {...props}>
      {children}
    </Wrapper>
  );
}

// Badge component
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <View className={`px-2.5 py-1 rounded-full self-start ${variants[variant]} ${className}`}>
      <Text className={`text-xs font-semibold ${variants[variant].split(' ')[1]}`}>{children}</Text>
    </View>
  );
}

// Empty state component
export function EmptyState({ icon = 'folder-open-outline', title, message, action, onAction }) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-6">
      <View className="w-20 h-20 rounded-full bg-primary-50 items-center justify-center mb-4">
        <Ionicons name={icon} size={36} color="#7c3aed" />
      </View>
      <Text className="text-lg font-semibold text-gray-800 mb-2 text-center">{title}</Text>
      {message && <Text className="text-sm text-gray-500 text-center mb-4">{message}</Text>}
      {action && (
        <Button variant="outline" size="sm" onPress={onAction}>
          {action}
        </Button>
      )}
    </View>
  );
}

// Loading spinner
export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#7c3aed" />
      <Text className="text-gray-500 mt-3 text-sm">{message}</Text>
    </View>
  );
}

// Avatar component
export function Avatar({ source, name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16', xl: 'w-20 h-20' };
  const textSizes = { sm: 'text-xs', md: 'text-base', lg: 'text-xl', xl: 'text-2xl' };
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (source) {
    return <Image source={{ uri: source }} className={`${sizes[size]} rounded-full ${className}`} />;
  }
  return (
    <View className={`${sizes[size]} rounded-full bg-primary-100 items-center justify-center ${className}`}>
      <Text className={`${textSizes[size]} font-bold text-primary-700`}>{initials}</Text>
    </View>
  );
}

// Divider
export function Divider({ className = '' }) {
  return <View className={`h-px bg-gray-200 my-3 ${className}`} />;
}

// Section header
export function SectionHeader({ title, action, onAction, className = '' }) {
  return (
    <View className={`flex-row items-center justify-between px-1 mb-3 ${className}`}>
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text className="text-sm font-medium text-primary-600">{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Icon button
export function IconButton({ icon, onPress, size = 24, color = '#374151', badge, className = '' }) {
  return (
    <TouchableOpacity onPress={onPress} className={`p-2 relative ${className}`} activeOpacity={0.7}>
      <Ionicons name={icon} size={size} color={color} />
      {badge > 0 && (
        <View className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center">
          <Text className="text-white text-[10px] font-bold">{badge > 99 ? '99+' : badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
