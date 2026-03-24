import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Badge, Divider, SectionHeader } from '../../components/ui';
import { API_BASE_URL } from '../../config';

const InfoRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <View className="flex-row items-center py-2">
      <Ionicons name={icon} size={16} color="#6b7280" />
      <Text className="text-xs text-gray-400 ml-2 w-24">{label}</Text>
      <Text className="text-sm text-gray-900 flex-1">{value}</Text>
    </View>
  );
};

export default function ChildDetailScreen({ route }) {
  const child = route?.params?.child;

  if (!child) return (
    <Screen><View className="flex-1 items-center justify-center"><Text>Child not found</Text></View></Screen>
  );

  const photoUrl = child.photo
    ? child.photo.startsWith('http') ? child.photo : `${API_BASE_URL}/${child.photo}`
    : null;

  return (
    <Screen scroll>
      <View className="px-5 pt-4 pb-6">
        {/* Header */}
        <View className="items-center mb-6">
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} className="w-24 h-24 rounded-full" />
          ) : (
            <Avatar name={child.name} size="xl" />
          )}
          <Text className="text-xl font-bold text-gray-900 mt-3">{child.name}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-sm text-gray-500">{child.className} • Section {child.section}</Text>
            <Badge variant="success">Active</Badge>
          </View>
        </View>

        {/* Basic Info */}
        <Card className="mb-4">
          <SectionHeader title="Basic Info" />
          <InfoRow icon="calendar-outline" label="DOB" value={child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString('en-IN') : null} />
          <InfoRow icon="male-female-outline" label="Gender" value={child.gender} />
          <InfoRow icon="water-outline" label="Blood Group" value={child.bloodGroup} />
          <InfoRow icon="medical-outline" label="Allergies" value={child.allergies} />
          <InfoRow icon="card-outline" label="Admission No" value={child.admissionNumber} />
        </Card>

        {/* Address */}
        {child.address && (
          <Card>
            <SectionHeader title="Address" />
            <Text className="text-sm text-gray-600">{child.address}</Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}
