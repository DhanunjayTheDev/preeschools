import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Badge, LoadingScreen, EmptyState, Input } from '../../components/ui';
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, [fetchStudents]);

  const renderStudent = ({ item }) => (
    <Card className="mb-2 flex-row items-center" onPress={() => navigation.navigate('StudentDetail', { student: item })}>
      <Avatar name={item.name} size="md" />
      <View className="flex-1 ml-3">
        <Text className="text-sm font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-xs text-gray-500">
          {item.className} • Section {item.section}
        </Text>
        {item.fatherName && (
          <Text className="text-xs text-gray-400">Parent: {item.fatherName}</Text>
        )}
      </View>
      <Badge variant={item.status === 'ACTIVE' ? 'success' : 'warning'}>
        {item.status}
      </Badge>
    </Card>
  );

  return (
    <Screen>
      <View className="px-5 pt-4 flex-1">
        <Text className="text-2xl font-bold text-gray-900 mb-1">
          Students {initialClass ? `- ${initialClass}` : ''}
        </Text>
        {initialSection && <Text className="text-sm text-gray-500 mb-3">Section {initialSection}</Text>}

        <Input
          placeholder="Search students..."
          value={search}
          onChangeText={setSearch}
          icon="search-outline"
          containerClassName="mb-3"
        />

        {loading ? (
          <LoadingScreen />
        ) : students.length === 0 ? (
          <EmptyState icon="people-outline" title="No Students" message="No students found" />
        ) : (
          <FlatList
            data={students}
            renderItem={renderStudent}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </Screen>
  );
}
