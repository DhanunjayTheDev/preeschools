import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, LoadingScreen, EmptyState } from '../../components/ui';
import api from '../../lib/api';

const typeColors = {
  GENERAL: 'default',
  ACADEMIC: 'primary',
  EVENT: 'info',
  HOLIDAY: 'success',
  EMERGENCY: 'danger',
};

const typeIcons = {
  GENERAL: 'information-circle',
  ACADEMIC: 'school',
  EVENT: 'calendar',
  HOLIDAY: 'sunny',
  EMERGENCY: 'warning',
};

export default function AnnouncementsScreen({ navigation }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const { data } = await api.get('/announcements/my');
      setAnnouncements(data.announcements || data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  if (loading) return <LoadingScreen />;

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <View className="px-5 pt-4 pb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Announcements</Text>

        {announcements.length === 0 ? (
          <EmptyState icon="megaphone-outline" title="No Announcements" message="No announcements at this time" />
        ) : (
          announcements.map((item) => (
            <Card key={item._id} className="mb-3" onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}>
              <View className="flex-row items-start">
                <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3">
                  <Ionicons name={typeIcons[item.type] || 'information-circle'} size={20} color="#ea580c" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-sm font-semibold text-gray-900 flex-1 mr-2" numberOfLines={1}>{item.title}</Text>
                    <Badge variant={typeColors[item.type] || 'default'}>{item.type}</Badge>
                  </View>
                  <Text className="text-xs text-gray-600" numberOfLines={3}>{item.content}</Text>
                  <Text className="text-[10px] text-gray-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}
