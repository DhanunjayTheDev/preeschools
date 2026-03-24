import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Badge, LoadingScreen, Divider, SectionHeader } from '../../components/ui';
import api from '../../lib/api';
import { API_BASE_URL } from '../../config';

const DetailRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <View className="flex-row items-center py-2">
      <Ionicons name={icon} size={16} color="#6b7280" />
      <Text className="text-xs text-gray-400 ml-2 w-24">{label}</Text>
      <Text className="text-sm text-gray-900 flex-1">{value}</Text>
    </View>
  );
};

export default function StudentDetailScreen({ route }) {
  const passedStudent = route?.params?.student;
  const studentId = route?.params?.studentId || passedStudent?._id;
  const [student, setStudent] = useState(passedStudent || null);
  const [loading, setLoading] = useState(!passedStudent);

  useEffect(() => {
    if (!passedStudent && studentId) {
      api.get(`/students/${studentId}`).then(({ data }) => {
        setStudent(data.student || data);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [studentId, passedStudent]);

  if (loading) return <LoadingScreen />;
  if (!student) return (
    <Screen><View className="flex-1 items-center justify-center"><Text>Student not found</Text></View></Screen>
  );

  const photoUrl = student.photo
    ? student.photo.startsWith('http') ? student.photo : `${API_BASE_URL}/${student.photo}`
    : null;

  return (
    <Screen scroll>
      <View className="px-5 pt-4 pb-6">
        {/* Header */}
        <View className="items-center mb-6">
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} className="w-24 h-24 rounded-full" />
          ) : (
            <Avatar name={student.name} size="xl" />
          )}
          <Text className="text-xl font-bold text-gray-900 mt-3">{student.name}</Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-sm text-gray-500">{student.className} • Section {student.section}</Text>
            <Badge variant={student.status === 'ACTIVE' ? 'success' : 'warning'}>
              {student.status}
            </Badge>
          </View>
        </View>

        {/* Student Info */}
        <Card className="mb-4">
          <SectionHeader title="Student Details" />
          <DetailRow icon="calendar-outline" label="DOB" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : null} />
          <DetailRow icon="male-female-outline" label="Gender" value={student.gender} />
          <DetailRow icon="water-outline" label="Blood Group" value={student.bloodGroup} />
          <DetailRow icon="medical-outline" label="Allergies" value={student.allergies} />
          <DetailRow icon="card-outline" label="Admission No" value={student.admissionNumber} />
        </Card>

        {/* Father Details */}
        {student.fatherName && (
          <Card className="mb-4">
            <SectionHeader title="Father's Details" />
            <DetailRow icon="person-outline" label="Name" value={student.fatherName} />
            <DetailRow icon="call-outline" label="Phone" value={student.fatherPhone} />
            <DetailRow icon="briefcase-outline" label="Occupation" value={student.fatherOccupation} />
          </Card>
        )}

        {/* Mother Details */}
        {student.motherName && (
          <Card className="mb-4">
            <SectionHeader title="Mother's Details" />
            <DetailRow icon="person-outline" label="Name" value={student.motherName} />
            <DetailRow icon="call-outline" label="Phone" value={student.motherPhone} />
            <DetailRow icon="briefcase-outline" label="Occupation" value={student.motherOccupation} />
          </Card>
        )}

        {/* Address */}
        {student.address && (
          <Card className="mb-4">
            <SectionHeader title="Address" />
            <Text className="text-sm text-gray-600">{student.address}</Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}
