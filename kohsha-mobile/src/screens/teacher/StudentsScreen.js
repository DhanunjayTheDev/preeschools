import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../components/ui';
import api from '../../lib/api';

export default function TeacherStudentsScreen({ route, navigation }) {
  const initialClass = route?.params?.className || '';
  const initialSection = route?.params?.section || '';
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      const params = {};
      if (initialClass) params.className = initialClass;
      if (initialSection) params.section = initialSection;
      if (search) params.search = search;
      const { data } = await api.get('/students', { params });
      setStudents(data.students || data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [initialClass, initialSection, search]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchStudents(); }, [fetchStudents]);

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('StudentDetail', { student: item })}
      activeOpacity={0.7}
      style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
    >
      <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#2563eb' }}>{item.name?.charAt(0)?.toUpperCase()}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>{item.name}</Text>
        <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
          {item.className} • Section {item.section}
        </Text>
        {item.fatherName && (
          <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>Parent: {item.fatherName}</Text>
        )}
      </View>
      <View style={{ backgroundColor: item.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
        <Text style={{ fontSize: 11, fontWeight: '600', color: item.status === 'ACTIVE' ? '#059669' : '#d97706' }}>{item.status}</Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color="#9ca3af" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2563eb' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Header */}
      <View style={{ backgroundColor: '#2563eb', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Class</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>
          {initialClass ? `${initialClass}${initialSection ? ' • ' + initialSection : ''}` : 'All Students'}
        </Text>
        {students.length > 0 && (
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>{students.length} students enrolled</Text>
        )}

        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, marginTop: 14 }}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.7)" />
          <TextInput
            placeholder="Search students..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8, color: '#fff', fontSize: 14 }}
          />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.7)" /></TouchableOpacity> : null}
        </View>
      </View>

      {loading ? (
        <LoadingScreen />
      ) : students.length === 0 ? (
        <View style={{ flex: 1, backgroundColor: '#f7f8ff', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="people-outline" size={28} color="#2563eb" />
          </View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 4 }}>No Students Found</Text>
          <Text style={{ fontSize: 13, color: '#6b7280', textAlign: 'center' }}>No students match your search</Text>
        </View>
      ) : (
        <FlatList
          data={students}
          renderItem={renderStudent}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ backgroundColor: '#f7f8ff' }}
          contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        />
      )}
    </SafeAreaView>
  );
}
