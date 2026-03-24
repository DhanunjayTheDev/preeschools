import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../components/ui';
import api from '../../lib/api';

const typeConfig = {
  HOMEWORK: { icon: 'document-text', color: '#7c3aed', bg: '#ede9fe', label: 'Homework' },
  CLASS_ACTIVITY: { icon: 'people', color: '#2563eb', bg: '#dbeafe', label: 'Class Activity' },
  PROJECT: { icon: 'construct', color: '#059669', bg: '#d1fae5', label: 'Project' },
};

export default function TeacherActivitiesScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const fetchActivities = useCallback(async () => {
    try {
      const { data } = await api.get('/activities/my');
      const list = data.activities || data || [];
      setActivities(list);
      setFiltered(list);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  useEffect(() => {
    let result = activities;
    if (activeFilter !== 'ALL') result = result.filter(a => a.type === activeFilter);
    if (search.trim()) result = result.filter(a => a.title?.toLowerCase().includes(search.toLowerCase()) || a.className?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, activeFilter, activities]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchActivities(); }, [fetchActivities]);

  const handleDelete = (activityId) => {
    Alert.alert('Delete Activity', 'Are you sure you want to delete this activity?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/activities/${activityId}`);
            setActivities(prev => prev.filter(a => a._id !== activityId));
          } catch {
            Alert.alert('Error', 'Failed to delete activity');
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingScreen />;

  const filters = ['ALL', 'HOMEWORK', 'CLASS_ACTIVITY', 'PROJECT'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2563eb' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

      {/* Header */}
      <View style={{ backgroundColor: '#2563eb', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Manage</Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>Activities</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreateActivity')}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9 }}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#2563eb" />
            <Text style={{ color: '#2563eb', fontWeight: '700', fontSize: 13, marginLeft: 4 }}>New</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10 }}>
          <Ionicons name="search" size={16} color="rgba(255,255,255,0.7)" />
          <TextInput
            placeholder="Search activities..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, marginLeft: 8, color: '#fff', fontSize: 14 }}
          />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.7)" /></TouchableOpacity> : null}
        </View>
      </View>

      {/* Filter pills */}
      <View style={{ backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: activeFilter === f ? '#2563eb' : '#f3f4f6' }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: activeFilter === f ? '#fff' : '#6b7280' }}>
                {f === 'ALL' ? 'All' : typeConfig[f]?.label || f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: '#f7f8ff' }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" colors={['#2563eb']} />}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="book-outline" size={28} color="#2563eb" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 4 }}>No Activities</Text>
            <Text style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Create your first activity</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreateActivity')}
              style={{ backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Create Activity</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.map((activity) => {
          const tc = typeConfig[activity.type] || typeConfig.CLASS_ACTIVITY;
          const isOverdue = activity.dueDate && new Date(activity.dueDate) < new Date();
          return (
            <TouchableOpacity
              key={activity._id}
              onPress={() => navigation.navigate('ActivityDetail', { activity })}
              activeOpacity={0.7}
              style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: tc.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name={tc.icon} size={22} color={tc.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }} numberOfLines={1}>{activity.title}</Text>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }} numberOfLines={2}>{activity.description}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, flexWrap: 'wrap', gap: 6 }}>
                    <View style={{ backgroundColor: tc.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: tc.color }}>{tc.label.toUpperCase()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="school-outline" size={12} color="#9ca3af" />
                      <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 3 }}>{activity.className}</Text>
                    </View>
                    {activity.dueDate && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="time-outline" size={12} color={isOverdue ? '#ef4444' : '#9ca3af'} />
                        <Text style={{ fontSize: 11, color: isOverdue ? '#ef4444' : '#6b7280', marginLeft: 3, fontWeight: isOverdue ? '600' : '400' }}>
                          {new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                    )}
                    {activity.submissions?.length > 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="checkmark-circle" size={12} color="#2563eb" />
                        <Text style={{ fontSize: 11, color: '#2563eb', marginLeft: 3, fontWeight: '600' }}>{activity.submissions.length} submitted</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDelete(activity._id)} style={{ padding: 6 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
