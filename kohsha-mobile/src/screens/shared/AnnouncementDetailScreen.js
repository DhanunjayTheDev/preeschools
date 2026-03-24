import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, Badge, LoadingScreen, Divider } from '../../components/ui';
import api from '../../lib/api';

export default function AnnouncementDetailScreen({ route }) {
  const passedAnnouncement = route?.params?.announcement;
  const announcementId = route?.params?.announcementId || passedAnnouncement?._id;
  const [announcement, setAnnouncement] = useState(passedAnnouncement || null);
  const [loading, setLoading] = useState(!passedAnnouncement);

  useEffect(() => {
    if (!passedAnnouncement && announcementId) {
      api.get(`/announcements/${announcementId}`).then(({ data }) => {
        setAnnouncement(data.announcement || data);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [announcementId, passedAnnouncement]);

  if (loading) return <LoadingScreen />;
  if (!announcement) return (
    <Screen><View className="flex-1 items-center justify-center"><Text>Announcement not found</Text></View></Screen>
  );

  const typeConfig = {
    GENERAL: { icon: 'megaphone', color: '#7c3aed', bg: '#7c3aed15' },
    EVENT: { icon: 'calendar', color: '#2563eb', bg: '#2563eb15' },
    HOLIDAY: { icon: 'sunny', color: '#ea580c', bg: '#ea580c15' },
    EMERGENCY: { icon: 'warning', color: '#dc2626', bg: '#dc262615' },
  };

  const config = typeConfig[announcement.type] || typeConfig.GENERAL;

  return (
    <Screen scroll>
      <View className="px-5 pt-4 pb-6">
        {/* Type badge */}
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: config.bg }}>
            <Ionicons name={config.icon} size={18} color={config.color} />
          </View>
          <Badge variant="primary">{announcement.type}</Badge>
        </View>

        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 mb-1">{announcement.title}</Text>
        <Text className="text-sm text-gray-500 mb-4">
          {new Date(announcement.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </Text>

        <Divider className="my-3" />

        {/* Message */}
        <Card className="mb-4">
          <Text className="text-sm text-gray-700 leading-5">{announcement.message}</Text>
        </Card>

        {/* Target Info */}
        {(announcement.targetClasses?.length > 0 || announcement.targetRole) && (
          <Card className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Target Audience</Text>
            {announcement.targetRole && (
              <View className="flex-row items-center mb-1">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="text-sm text-gray-600 ml-2 capitalize">{announcement.targetRole}</Text>
              </View>
            )}
            {announcement.targetClasses?.length > 0 && (
              <View className="flex-row flex-wrap gap-1 mt-1">
                {announcement.targetClasses.map((cls, idx) => (
                  <Badge key={idx} variant="secondary">{cls}</Badge>
                ))}
              </View>
            )}
          </Card>
        )}

        {/* Created by */}
        {announcement.createdBy?.name && (
          <Text className="text-xs text-gray-400 mt-2">Posted by: {announcement.createdBy.name}</Text>
        )}
      </View>
    </Screen>
  );
}
