import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, LoadingScreen, Divider } from '../../components/ui';
import api from '../../lib/api';
import { API_BASE_URL } from '../../config';

export default function ActivityDetailScreen({ route }) {
  const passedActivity = route?.params?.activity;
  const activityId = route?.params?.activityId || passedActivity?._id;
  const [activity, setActivity] = useState(passedActivity || null);
  const [loading, setLoading] = useState(!passedActivity);

  useEffect(() => {
    if (!passedActivity && activityId) {
      api.get(`/activities/${activityId}`).then(({ data }) => {
        setActivity(data.activity || data);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [activityId, passedActivity]);

  if (loading) return <LoadingScreen />;
  if (!activity) return (
    <Screen><View className="flex-1 items-center justify-center"><Text>Activity not found</Text></View></Screen>
  );

  const typeColor = {
    HOMEWORK: '#7c3aed',
    CLASS_ACTIVITY: '#2563eb',
    PROJECT: '#059669',
  };

  return (
    <Screen scroll>
      <View className="px-5 pt-4 pb-6">
        {/* Header */}
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Badge variant="primary" style={{ backgroundColor: (typeColor[activity.type] || '#7c3aed') + '20' }}>
              <Text style={{ color: typeColor[activity.type] || '#7c3aed' }}>{activity.type?.replace('_', ' ')}</Text>
            </Badge>
            <Text className="text-xs text-gray-400">{activity.className}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900">{activity.title}</Text>
          {activity.dueDate && (
            <Text className="text-sm text-gray-500 mt-1">
              Due: {new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          )}
        </View>

        <Divider className="my-3" />

        {/* Description */}
        {activity.description && (
          <Card className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
            <Text className="text-sm text-gray-600 leading-5">{activity.description}</Text>
          </Card>
        )}

        {/* Attachments */}
        {activity.attachments?.length > 0 && (
          <Card className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Attachments</Text>
            {activity.attachments.map((attachment, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  const url = attachment.startsWith('http') ? attachment : `${API_BASE_URL}/${attachment}`;
                  Linking.openURL(url);
                }}
                className="flex-row items-center py-2 border-b border-gray-50"
              >
                <Ionicons name="attach" size={16} color="#7c3aed" />
                <Text className="text-sm text-primary-600 ml-2 flex-1" numberOfLines={1}>
                  {attachment.split('/').pop()}
                </Text>
                <Ionicons name="open-outline" size={14} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Submissions */}
        {activity.submissions?.length > 0 && (
          <Card className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Submissions ({activity.submissions.length})
            </Text>
            {activity.submissions.map((sub, idx) => (
              <View key={idx} className="flex-row items-center py-2 border-b border-gray-50">
                <View className="w-7 h-7 rounded-full bg-primary-50 items-center justify-center mr-2">
                  <Ionicons name="person" size={14} color="#7c3aed" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-900">{sub.studentName || 'Student'}</Text>
                  <Text className="text-xs text-gray-400">
                    {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString('en-IN')}
                  </Text>
                </View>
                {sub.grade && <Badge variant="success">{sub.grade}</Badge>}
              </View>
            ))}
          </Card>
        )}

        {/* Created info */}
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-xs text-gray-400">
            Created: {new Date(activity.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
          {activity.createdBy?.name && (
            <Text className="text-xs text-gray-400">By: {activity.createdBy.name}</Text>
          )}
        </View>
      </View>
    </Screen>
  );
}
