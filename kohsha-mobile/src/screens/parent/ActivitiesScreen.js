import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, LoadingScreen, EmptyState } from '../../components/ui';
import api from '../../lib/api';

const typeIcons = {
  HOMEWORK: { icon: 'document-text', color: '#7c3aed' },
  CLASS_ACTIVITY: { icon: 'people', color: '#2563eb' },
  PROJECT: { icon: 'construct', color: '#059669' },
};

export default function ParentActivitiesScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchActivities();
  }, [fetchActivities]);

  if (loading) return <LoadingScreen />;

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <View className="px-5 pt-4 pb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Activities</Text>

        {activities.length === 0 ? (
          <EmptyState icon="book-outline" title="No Activities" message="No activities assigned for your children yet" />
        ) : (
          activities.map((activity) => {
            const typeInfo = typeIcons[activity.type] || typeIcons.CLASS_ACTIVITY;
            return (
              <Card key={activity._id} className="mb-3" onPress={() => navigation.navigate('ActivityDetail', { activity })}>
                <View className="flex-row items-start">
                  <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: typeInfo.color + '15' }}>
                    <Ionicons name={typeInfo.icon} size={20} color={typeInfo.color} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-semibold text-gray-900 flex-1" numberOfLines={1}>{activity.title}</Text>
                      <Badge variant={activity.type === 'HOMEWORK' ? 'primary' : activity.type === 'PROJECT' ? 'success' : 'info'}>
                        {activity.type?.replace('_', ' ')}
                      </Badge>
                    </View>
                    <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>{activity.description}</Text>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-xs text-gray-400">{activity.className} {activity.section && `• ${activity.section}`}</Text>
                      {activity.dueDate && (
                        <View className="flex-row items-center ml-3">
                          <Ionicons name="time-outline" size={12} color={isOverdue(activity.dueDate) ? '#ef4444' : '#9ca3af'} />
                          <Text className={`text-xs ml-1 ${isOverdue(activity.dueDate) ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                            {new Date(activity.dueDate).toLocaleDateString()}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </View>
    </Screen>
  );
}
