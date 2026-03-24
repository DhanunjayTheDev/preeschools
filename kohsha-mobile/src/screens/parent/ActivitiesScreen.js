import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../components/ui';
import api from '../../lib/api';

const typeConfig = {
  HOMEWORK: { icon: 'document-text', color: '#7c3aed', bg: '#ede9fe', label: 'Homework' },
  CLASS_ACTIVITY: { icon: 'people', color: '#2563eb', bg: '#dbeafe', label: 'Class Activity' },
  PROJECT: { icon: 'construct', color: '#059669', bg: '#d1fae5', label: 'Project' },
};

export default function ParentActivitiesScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const fetchActivities = useCallback(async () => {
    try {
      const { data } = await api.get('/activities/parent');
      setActivities(data.activities || data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchActivities(); }, [fetchActivities]);

  if (loading) return <LoadingScreen />;

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();
  const filters = ['ALL', 'HOMEWORK', 'CLASS_ACTIVITY', 'PROJECT'];
  const filtered = activeFilter === 'ALL' ? activities : activities.filter(a => a.type === activeFilter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7c3aed' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />

      {/* Header */}
      <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Your children's</Text>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>Activities</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>{activities.length} total activities</Text>
      </View>

      {/* Filter pills */}
      <View style={{ backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={{ marginRight: 8, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: activeFilter === f ? '#7c3aed' : '#f3f4f6' }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: activeFilter === f ? '#fff' : '#6b7280' }}>
                {f === 'ALL' ? 'All' : typeConfig[f]?.label || f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: '#f8f7ff' }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" colors={['#7c3aed']} />}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="book-outline" size={28} color="#7c3aed" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 4 }}>No Activities</Text>
            <Text style={{ fontSize: 13, color: '#6b7280' }}>No activities assigned yet</Text>
          </View>
        ) : filtered.map((activity) => {
          const tc = typeConfig[activity.type] || typeConfig.CLASS_ACTIVITY;
          const overdue = activity.dueDate && isOverdue(activity.dueDate);
          return (
            <TouchableOpacity
              key={activity._id}
              onPress={() => navigation.navigate('ActivityDetail', { activity })}
              activeOpacity={0.7}
              style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 3 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: tc.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ionicons name={tc.icon} size={22} color={tc.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937', flex: 1 }} numberOfLines={1}>{activity.title}</Text>
                    <View style={{ backgroundColor: tc.bg, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, marginLeft: 8 }}>
                      <Text style={{ fontSize: 9, fontWeight: '700', color: tc.color }}>{tc.label.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 17 }} numberOfLines={2}>{activity.description}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="school-outline" size={12} color="#9ca3af" />
                      <Text style={{ fontSize: 11, color: '#6b7280', marginLeft: 3 }}>{activity.className}{activity.section ? ` • ${activity.section}` : ''}</Text>
                    </View>
                    {activity.dueDate && (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="time-outline" size={12} color={overdue ? '#ef4444' : '#9ca3af'} />
                        <Text style={{ fontSize: 11, color: overdue ? '#ef4444' : '#6b7280', marginLeft: 3, fontWeight: overdue ? '700' : '400' }}>
                          {overdue ? 'Overdue • ' : ''}{new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9ca3af" style={{ marginLeft: 8, marginTop: 2 }} />
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
