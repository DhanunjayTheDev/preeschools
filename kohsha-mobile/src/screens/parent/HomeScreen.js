import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Avatar, Badge, LoadingScreen, SectionHeader } from '../../components/ui';
import useAuthStore from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import api from '../../lib/api';

const quickActions = [
  { id: 'fees', icon: 'wallet-outline', label: 'Fees', color: '#7c3aed', tab: 'Fees' },
  { id: 'activities', icon: 'book-outline', label: 'Activities', color: '#2563eb', tab: 'Activities' },
  { id: 'calendar', icon: 'calendar-outline', label: 'Calendar', color: '#059669', tab: 'Calendar' },
  { id: 'announcements', icon: 'megaphone-outline', label: 'Updates', color: '#ea580c', screen: 'ParentAnnouncements' },
];

export default function ParentHomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [children, setChildren] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [childrenRes, announcementsRes] = await Promise.all([
        api.get('/students/my-children'),
        api.get('/announcements/my'),
      ]);
      setChildren(childrenRes.data.students || childrenRes.data || []);
      const announcements = announcementsRes.data.announcements || announcementsRes.data || [];
      setRecentAnnouncements(announcements.slice(0, 3));
    } catch (error) {
      console.error('Error fetching parent data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
              onPress={() => action.tab ? navigation.getParent().navigate(action.tab) : navigation.navigate(action.screen)}
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

        {/* My Children */}
        {children.length > 0 && (
          <View className="mb-6">
            <SectionHeader title="My Children" />
            {children.map((child) => (
              <Card key={child._id} className="mb-3 flex-row items-center" onPress={() => navigation.navigate('ChildDetail', { child })}>
                <Avatar name={child.name} size="md" />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-gray-900">{child.name}</Text>
                  <Text className="text-sm text-gray-500">
                    {child.className} • Section {child.section}
                  </Text>
                </View>
                <Badge variant={child.status === 'ACTIVE' ? 'success' : 'warning'}>
                  {child.status}
                </Badge>
              </Card>
            ))}
          </View>
        )}

        {/* Recent Announcements */}
        {recentAnnouncements.length > 0 && (
          <View className="mb-6">
            <SectionHeader title="Recent Updates" action="View All" onAction={() => navigation.navigate('ParentAnnouncements')} />
            {recentAnnouncements.map((item) => (
              <Card key={item._id} className="mb-3" onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}>
                <View className="flex-row items-start">
                  <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
                    <Ionicons name="megaphone" size={18} color="#ea580c" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>{item.title}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={2}>{item.content}</Text>
                    <Text className="text-[10px] text-gray-400 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
