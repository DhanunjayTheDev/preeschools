import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, LoadingScreen, EmptyState, Button } from '../../components/ui';
import useNotificationStore from '../../stores/notificationStore';

const typeIcons = {
  announcement: { icon: 'megaphone', color: '#7c3aed' },
  activity: { icon: 'book', color: '#2563eb' },
  fee: { icon: 'wallet', color: '#059669' },
  general: { icon: 'notifications', color: '#6b7280' },
};

export default function NotificationsScreen({ navigation }) {
  const { notifications, loading, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, [fetchNotifications]);

  const handlePress = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    // Navigate based on type
    if (notification.type === 'activity' && notification.referenceId) {
      navigation.navigate('ActivityDetail', { activityId: notification.referenceId });
    } else if (notification.type === 'announcement' && notification.referenceId) {
      navigation.navigate('AnnouncementDetail', { announcementId: notification.referenceId });
    } else if (notification.type === 'fee' && notification.referenceId) {
      navigation.navigate('FeeDetail', { feeId: notification.referenceId });
    }
  };

  const getIcon = (type) => typeIcons[type] || typeIcons.general;

  const renderNotification = ({ item }) => {
    const { icon, color } = getIcon(item.type);
    return (
      <Card className={`mb-2 ${!item.read ? 'border-l-4 border-l-primary-500' : ''}`} onPress={() => handlePress(item)}>
        <View className="flex-row items-start">
          <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: color + '15' }}>
            <Ionicons name={icon} size={18} color={color} />
          </View>
          <View className="flex-1">
            <Text className={`text-sm ${!item.read ? 'font-semibold' : 'font-normal'} text-gray-900`} numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={2}>{item.body}</Text>
            <Text className="text-[10px] text-gray-400 mt-1">
              {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          {!item.read && <View className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-1" />}
        </View>
      </Card>
    );
  };

  return (
    <Screen>
      <View className="px-5 pt-4 flex-1">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900">Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text className="text-sm text-primary-600 font-medium">Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading && notifications.length === 0 ? (
          <LoadingScreen />
        ) : notifications.length === 0 ? (
          <EmptyState icon="notifications-off-outline" title="No Notifications" message="You're all caught up!" />
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
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
