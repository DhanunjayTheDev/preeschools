import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../components/ui';
import api from '../../lib/api';
import { API_BASE_URL } from '../../config';

function InfoSection({ icon, title, iconBg, iconColor, children }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: iconBg || '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <Ionicons name={icon} size={16} color={iconColor || '#6b7280'} />
        </View>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function DetailRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f9fafb' }}>
      <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
        <Ionicons name={icon} size={14} color="#6b7280" />
      </View>
      <Text style={{ fontSize: 12, color: '#9ca3af', width: 90 }}>{label}</Text>
      <Text style={{ flex: 1, fontSize: 13, color: '#1f2937', fontWeight: '500' }}>{value}</Text>
    </View>
  );
}

export default function StudentDetailScreen({ route, navigation }) {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f8ff' }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6b7280' }}>Student not found</Text>
      </View>
    </SafeAreaView>
  );

  const photoUrl = student.photo
    ? student.photo.startsWith('http') ? student.photo : `${API_BASE_URL}/${student.photo}`
    : null;
  const initials = student.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const isActive = student.status === 'ACTIVE';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2563eb' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Hero */}
      <View style={{ backgroundColor: '#2563eb', paddingBottom: 32, alignItems: 'center', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -30, right: -20, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginTop: 14, alignSelf: 'flex-start', marginLeft: 20, marginBottom: 8 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', marginTop: 20 }} />
        ) : (
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>{initials}</Text>
          </View>
        )}
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 12 }}>{student.name}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
          {student.className}{student.section ? ` · Section ${student.section}` : ''}
        </Text>
        <View style={{ backgroundColor: isActive ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 5, marginTop: 8 }}>
          <Text style={{ color: isActive ? '#6ee7b7' : '#fcd34d', fontSize: 11, fontWeight: '700' }}>{student.status}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#f7f8ff' }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <InfoSection icon="person-outline" title="Student Details" iconBg="#dbeafe" iconColor="#2563eb">
          <DetailRow icon="calendar-outline" label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-IN') : null} />
          <DetailRow icon="male-female-outline" label="Gender" value={student.gender} />
          <DetailRow icon="water-outline" label="Blood Group" value={student.bloodGroup} />
          <DetailRow icon="medical-outline" label="Allergies" value={student.allergies} />
          <DetailRow icon="card-outline" label="Admission No" value={student.admissionNumber} />
        </InfoSection>

        {student.fatherName && (
          <InfoSection icon="man-outline" title="Father's Details" iconBg="#f3f4f6" iconColor="#374151">
            <DetailRow icon="person-outline" label="Name" value={student.fatherName} />
            <DetailRow icon="call-outline" label="Phone" value={student.fatherPhone} />
            <DetailRow icon="briefcase-outline" label="Occupation" value={student.fatherOccupation} />
          </InfoSection>
        )}

        {student.motherName && (
          <InfoSection icon="woman-outline" title="Mother's Details" iconBg="#fce7f3" iconColor="#db2777">
            <DetailRow icon="person-outline" label="Name" value={student.motherName} />
            <DetailRow icon="call-outline" label="Phone" value={student.motherPhone} />
            <DetailRow icon="briefcase-outline" label="Occupation" value={student.motherOccupation} />
          </InfoSection>
        )}

        {student.address && (
          <InfoSection icon="location-outline" title="Address" iconBg="#f3f4f6" iconColor="#6b7280">
            <Text style={{ fontSize: 14, color: '#4b5563', lineHeight: 21 }}>{student.address}</Text>
          </InfoSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
