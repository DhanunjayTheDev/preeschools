import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, Button, LoadingScreen, EmptyState, Input } from '../../components/ui';
import api from '../../lib/api';

export default function TeacherActivitiesScreen({ navigation }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchActivities = useCallback(async () => {
    try {
      const { data } = await api.get('/activities/my');
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

  const handleDelete = (activityId) => {
    Alert.alert('Delete Activity', 'Are you sure you want to delete this activity?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/activities/${activityId}`);
            setActivities((prev) => prev.filter((a) => a._id !== activityId));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete activity');
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingScreen />;

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <View className="px-5 pt-4 pb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Activities</Text>
          <Button size="sm" icon="add" onPress={() => navigation.navigate('CreateActivity')}>
            New
          </Button>
        </View>

        {activities.length === 0 ? (
          <EmptyState
            icon="book-outline"
            title="No Activities"
            message="Create your first activity"
            action="Create Activity"
            onAction={() => navigation.navigate('CreateActivity')}
          />
        ) : (
          activities.map((activity) => (
            <Card key={activity._id} className="mb-3">
              <TouchableOpacity onPress={() => navigation.navigate('ActivityDetail', { activity })} activeOpacity={0.7}>
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-3">
                    <Text className="text-sm font-semibold text-gray-900">{activity.title}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={2}>{activity.description}</Text>
                    <View className="flex-row items-center mt-2 gap-2">
                      <Badge variant="primary">{activity.type?.replace('_', ' ')}</Badge>
                      <Text className="text-xs text-gray-400">{activity.className}</Text>
                      {activity.dueDate && (
                        <Text className="text-xs text-gray-400">
                          Due: {new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </Text>
                      )}
                    </View>
                    {activity.submissions?.length > 0 && (
                      <Text className="text-xs text-primary-600 mt-1">
                        {activity.submissions.length} submission(s)
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(activity._id)} className="p-1">
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Card>
          ))
        )}
      </View>
    </Screen>
  );
}
