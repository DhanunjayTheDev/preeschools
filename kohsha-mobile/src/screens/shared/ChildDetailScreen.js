import React from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../../config';

function InfoRow({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f9fafb' }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Ionicons name={icon} size={15} color="#6b7280" />
      </View>
      <Text style={{ fontSize: 12, color: '#9ca3af', width: 96 }}>{label}</Text>
      <Text style={{ flex: 1, fontSize: 14, color: '#1f2937', fontWeight: '500' }}>{value}</Text>
    </View>
  );
}

export default function ChildDetailScreen({ route, navigation }) {
  const child = route?.params?.child;

  if (!child) return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f7ff' }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6b7280' }}>Child not found</Text>
      </View>
    </SafeAreaView>
  );

  const photoUrl = child.photo
    ? child.photo.startsWith('http') ? child.photo : `${API_BASE_URL}/${child.photo}`
    : null;
  const initials = child.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7c3aed' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />

      {/* Hero */}
      <View style={{ backgroundColor: '#7c3aed', paddingBottom: 32, alignItems: 'center', overflow: 'hidden' }}>
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
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 12 }}>{child.name}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 4 }}>
          {child.className}{child.section ? ` · Section ${child.section}` : ''}
        </Text>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 5, marginTop: 8 }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ACTIVE</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#f8f7ff' }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Basic Info */}
        <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              <Ionicons name="person-outline" size={16} color="#7c3aed" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>Basic Info</Text>
          </View>
          <InfoRow icon="calendar-outline" label="Date of Birth" value={child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString('en-IN') : null} />
          <InfoRow icon="male-female-outline" label="Gender" value={child.gender} />
          <InfoRow icon="water-outline" label="Blood Group" value={child.bloodGroup} />
          <InfoRow icon="medical-outline" label="Allergies" value={child.allergies} />
          <InfoRow icon="card-outline" label="Admission No" value={child.admissionNumber} />
        </View>

        {/* Address */}
        {child.address && (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>Address</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#4b5563', lineHeight: 21 }}>{child.address}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
