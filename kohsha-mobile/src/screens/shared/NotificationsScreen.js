import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useNotificationStore from '../../stores/notificationStore';

const typeConfig = {
  announcement: { icon: 'megaphone', color: '#7c3aed', bg: '#ede9fe' },
  activity: { icon: 'book', color: '#2563eb', bg: '#dbeafe' },
  fee: { icon: 'wallet', color: '#059669', bg: '#d1fae5' },
  general: { icon: 'notifications', color: '#6b7280', bg: '#f3f4f6' },
};

export default function NotificationsScreen({ navigation, route }) {
  const canGoBack = navigation.canGoBack();
  const { notifications, loading, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, [fetchNotifications]);

  const handlePress = async (notification) => {
    if (!notification.read) await markAsRead(notification._id);
    if (notification.type === 'activity' && notification.referenceId)
      navigation.navigate('ActivityDetail', { activityId: notification.referenceId });
    else if (notification.type === 'announcement' && notification.referenceId)
      navigation.navigate('AnnouncementDetail', { announcementId: notification.referenceId });
  };

  const renderNotification = ({ item, index }) => {
    const tc = typeConfig[item.type] || typeConfig.general;
    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
        style={[
          { 
            backgroundColor: '#fff', 
            borderRadius: 16, 
            padding: 14, 
            marginBottom: 10, 
            flexDirection: 'row', 
            alignItems: 'flex-start', 
            borderLeftWidth: 4,
            borderLeftColor: !item.read ? tc.color : '#e5e7eb',
            shadowColor: '#000', 
            shadowOpacity: 0.04, 
            shadowRadius: 6, 
            shadowOffset: { width: 0, height: 2 }, 
            elevation: 2 
          },
        ]}
      >
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: tc.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
          <Ionicons name={tc.icon} size={22} color={tc.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: !item.read ? '700' : '600', color: '#1f2937' }} numberOfLines={1}>{item.title}</Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4, lineHeight: 16 }} numberOfLines={2}>{item.body}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Text style={{ fontSize: 10, color: '#9ca3af' }}>
              {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Text>
            {!item.read && (
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: tc.color, marginLeft: 8 }} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7c3aed' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />

      {/* Hero Header */}
      <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <View style={{ position: 'absolute', bottom: -20, left: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.05)' }} />
        
        <View style={{ position: 'relative', zIndex: 1 }}>
          {canGoBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' }}>Stay Updated</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 6 }}>Notifications</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
            {unreadCount > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fca5a5', marginRight: 6 }} />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{unreadCount} unread</Text>
              </View>
            )}
            
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={markAllAsRead}
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Mark all read</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      {loading && notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name="notifications-off-outline" size={40} color="#9ca3af" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 6 }}>All caught up!</Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>You're all set. No new notifications at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ backgroundColor: '#fafafa' }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}

