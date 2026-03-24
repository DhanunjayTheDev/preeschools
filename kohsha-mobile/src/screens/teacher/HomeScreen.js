import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Badge, LoadingScreen, SectionHeader } from '../../components/ui';
import useAuthStore from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import api from '../../lib/api';

const quickActions = [
  { id: 'activities', icon: 'book-outline', label: 'Activities', color: '#7c3aed', tab: 'Activities' },
  { id: 'students', icon: 'people-outline', label: 'Students', color: '#2563eb', tab: 'Students' },
  { id: 'calendar', icon: 'calendar-outline', label: 'Calendar', color: '#059669', tab: 'Calendar' },
  { id: 'announcements', icon: 'megaphone-outline', label: 'Updates', color: '#ea580c', screen: 'TeacherAnnouncements' },
];

export default function TeacherHomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [stats, setStats] = useState({ totalStudents: 0, classes: [] });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [activitiesRes, announcementsRes] = await Promise.all([
        api.get('/activities/my'),
        api.get('/announcements/my'),
      ]);

      const activities = activitiesRes.data.activities || activitiesRes.data || [];
      setRecentActivities(activities.slice(0, 5));

      // Build stats from assigned classes
      setStats({
        totalStudents: 0,
        classes: user?.assignedClasses || [],
      });
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingScreen />;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <View className="px-5 pt-4 pb-2">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-sm text-gray-500">{greeting()} 👋</Text>
            <Text className="text-2xl font-bold text-gray-900">{user?.name?.split(' ')[0]}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="relative">
            <View className="w-11 h-11 rounded-full bg-primary-50 items-center justify-center">
              <Ionicons name="notifications-outline" size={22} color="#7c3aed" />
            </View>
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center">
                <Text className="text-white text-[10px] font-bold">{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={() => {
                if (action.tab) {
                  navigation.getParent()?.navigate(action.tab);
                } else if (action.screen) {
                  navigation.navigate(action.screen);
                }
              }}
              className="flex-1 min-w-[22%] items-center bg-white rounded-2xl py-4 px-2 shadow-sm border border-gray-100"
              activeOpacity={0.7}
            >
              <View className="w-12 h-12 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: action.color + '15' }}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text className="text-xs font-medium text-gray-700">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Assigned Classes */}
        {stats.classes?.length > 0 && (
          <View className="mb-6">
            <SectionHeader title="My Classes" />
            <View className="flex-row flex-wrap gap-2">
              {stats.classes.map((cls, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => navigation.navigate('TeacherStudents', { className: cls.className, section: cls.section })}
                  activeOpacity={0.7}
                >
                  <Card className="flex-row items-center px-4 py-3">
                    <View className="w-9 h-9 rounded-lg bg-blue-50 items-center justify-center mr-3">
                      <Ionicons name="school" size={18} color="#2563eb" />
                    </View>
                    <View>
                      <Text className="text-sm font-semibold text-gray-900">{cls.className}</Text>
                      <Text className="text-xs text-gray-500">Section {cls.section}</Text>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <View className="mb-6">
            <SectionHeader title="Recent Activities" action="View All" onAction={() => navigation.navigate('TeacherActivities')} />
            {recentActivities.map((activity) => (
              <Card key={activity._id} className="mb-2" onPress={() => navigation.navigate('ActivityDetail', { activity })}>
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-lg bg-primary-50 items-center justify-center mr-3">
                    <Ionicons name="document-text" size={16} color="#7c3aed" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>{activity.title}</Text>
                    <Text className="text-xs text-gray-400">
                      {activity.className} • {activity.type?.replace('_', ' ')}
                    </Text>
                  </View>
                  {activity.dueDate && (
                    <Text className="text-xs text-gray-400">
                      {new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </Text>
                  )}
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
