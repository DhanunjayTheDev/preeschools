import React, { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { Screen, Input, Button, Card } from '../../components/ui';
import useAuthStore from '../../stores/authStore';
import api from '../../lib/api';

const TYPES = ['HOMEWORK', 'CLASS_ACTIVITY', 'PROJECT'];

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

  return (
    <Screen scroll>
      <View className="px-5 pt-4 pb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-5">New Activity</Text>

        <Input
          label="Title"
          placeholder="Enter activity title"
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
          required
        />

        <Input
          label="Description"
          placeholder="Enter activity description"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          multiline
          numberOfLines={4}
          className="min-h-[100px] text-top"
          textAlignVertical="top"
        />

        {/* Type selector */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Type<Text className="text-red-500"> *</Text>
          </Text>
          <View className="flex-row gap-2">
            {TYPES.map((type) => (
              <View key={type} className="flex-1">
                <Button
                  variant={form.type === type ? 'primary' : 'secondary'}
                  size="sm"
                  onPress={() => setForm({ ...form, type })}
                >
                  {type.replace('_', ' ')}
                </Button>
              </View>
            ))}
          </View>
        </View>

        {/* Class selector from assigned classes */}
        {user?.assignedClasses?.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Class<Text className="text-red-500"> *</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {user.assignedClasses.map((cls, idx) => (
                  <Button
                    key={idx}
                    variant={form.className === cls.className && form.section === cls.section ? 'primary' : 'secondary'}
                    size="sm"
                    onPress={() => setForm({ ...form, className: cls.className, section: cls.section })}
                  >
                    {cls.className} - {cls.section}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {!user?.assignedClasses?.length && (
          <Input
            label="Class"
            placeholder="e.g., LKG"
            value={form.className}
            onChangeText={(text) => setForm({ ...form, className: text })}
            required
          />
        )}

        <Input
          label="Due Date (YYYY-MM-DD)"
          placeholder="e.g., 2026-04-15"
          value={form.dueDate}
          onChangeText={(text) => setForm({ ...form, dueDate: text })}
        />

        <Button onPress={handleSubmit} loading={loading} size="lg" className="mt-4">
          Create Activity
        </Button>
      </View>
    </Screen>
  );
}
