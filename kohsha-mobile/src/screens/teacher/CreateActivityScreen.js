import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../../stores/authStore';
import api from '../../lib/api';

const TYPES = [
  { key: 'HOMEWORK', label: 'Homework', icon: 'document-text', color: '#7c3aed', bg: '#ede9fe' },
  { key: 'CLASS_ACTIVITY', label: 'Class Activity', icon: 'people', color: '#2563eb', bg: '#dbeafe' },
  { key: 'PROJECT', label: 'Project', icon: 'construct', color: '#059669', bg: '#d1fae5' },
];

function FormField({ label, required, children }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
        {label}{required && <Text style={{ color: '#ef4444' }}> *</Text>}
      </Text>
      {children}
    </View>
  );
}

export default function CreateActivityScreen({ navigation }) {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'HOMEWORK',
    className: user?.assignedClasses?.[0]?.className || '',
    section: user?.assignedClasses?.[0]?.section || '',
    dueDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.className.trim()) {
      Alert.alert('Validation', 'Title and Class are required');
      return;
    }
    setLoading(true);
    try {
      await api.post('/activities', {
        ...form,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
      });
      Alert.alert('Success', 'Activity created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create activity');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = TYPES.find(t => t.key === form.type);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2563eb' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Header */}
      <View style={{ backgroundColor: '#2563eb', paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -15, right: -15, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11 }}>New Activity</Text>
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>Create Activity</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#f7f8ff' }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* Type Selector */}
        <FormField label="Activity Type" required>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {TYPES.map(type => (
              <TouchableOpacity
                key={type.key}
                onPress={() => setForm({ ...form, type: type.key })}
                activeOpacity={0.7}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 2, borderColor: form.type === type.key ? type.color : 'transparent', backgroundColor: form.type === type.key ? type.bg : '#fff', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 1 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: form.type === type.key ? type.color + '20' : '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                  <Ionicons name={type.icon} size={18} color={form.type === type.key ? type.color : '#9ca3af'} />
                </View>
                <Text style={{ fontSize: 10, fontWeight: '700', color: form.type === type.key ? type.color : '#6b7280', textAlign: 'center' }}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </FormField>

        {/* Title */}
        <FormField label="Title" required>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: form.title ? '#2563eb' : '#e5e7eb', paddingHorizontal: 14, paddingVertical: 12 }}>
            <Ionicons name="create-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Enter activity title"
              placeholderTextColor="#9ca3af"
              value={form.title}
              onChangeText={text => setForm({ ...form, title: text })}
              style={{ flex: 1, fontSize: 14, color: '#1f2937' }}
            />
          </View>
        </FormField>

        {/* Description */}
        <FormField label="Description">
          <View style={{ backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: form.description ? '#2563eb' : '#e5e7eb', padding: 14 }}>
            <TextInput
              placeholder="Describe the activity..."
              placeholderTextColor="#9ca3af"
              value={form.description}
              onChangeText={text => setForm({ ...form, description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ fontSize: 14, color: '#1f2937', minHeight: 90 }}
            />
          </View>
        </FormField>

        {/* Class Selector */}
        {user?.assignedClasses?.length > 0 ? (
          <FormField label="Assign to Class" required>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {user.assignedClasses.map((cls, idx) => {
                  const isSelected = form.className === cls.className && form.section === cls.section;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => setForm({ ...form, className: cls.className, section: cls.section })}
                      style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: isSelected ? '#2563eb' : '#e5e7eb', backgroundColor: isSelected ? '#dbeafe' : '#fff' }}
                    >
                      <Ionicons name="school" size={14} color={isSelected ? '#2563eb' : '#9ca3af'} />
                      <Text style={{ marginLeft: 6, fontSize: 13, fontWeight: '600', color: isSelected ? '#2563eb' : '#6b7280' }}>
                        {cls.className} - {cls.section}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </FormField>
        ) : (
          <FormField label="Class Name" required>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: form.className ? '#2563eb' : '#e5e7eb', paddingHorizontal: 14, paddingVertical: 12 }}>
              <Ionicons name="school-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="e.g., LKG"
                placeholderTextColor="#9ca3af"
                value={form.className}
                onChangeText={text => setForm({ ...form, className: text })}
                style={{ flex: 1, fontSize: 14, color: '#1f2937' }}
              />
            </View>
          </FormField>
        )}

        {/* Due Date */}
        <FormField label="Due Date">
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1.5, borderColor: form.dueDate ? '#2563eb' : '#e5e7eb', paddingHorizontal: 14, paddingVertical: 12 }}>
            <Ionicons name="calendar-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="YYYY-MM-DD (e.g., 2026-04-15)"
              placeholderTextColor="#9ca3af"
              value={form.dueDate}
              onChangeText={text => setForm({ ...form, dueDate: text })}
              style={{ flex: 1, fontSize: 14, color: '#1f2937' }}
            />
          </View>
        </FormField>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
          style={{ backgroundColor: loading ? '#93c5fd' : '#2563eb', borderRadius: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 32 }}
        >
          {loading ? (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Creating...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Create Activity</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

