import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../components/ui';
import useAuthStore from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import api from '../../lib/api';

const quickActions = [
  { id: 'activities', icon: 'book', label: 'Activities', color: '#7c3aed', bg: '#ede9fe', tab: 'Activities' },
  { id: 'students', icon: 'people', label: 'Students', color: '#2563eb', bg: '#dbeafe', tab: 'Students' },
  { id: 'calendar', icon: 'calendar', label: 'Calendar', color: '#059669', bg: '#d1fae5', tab: 'Calendar' },
  { id: 'updates', icon: 'megaphone', label: 'Updates', color: '#ea580c', bg: '#ffedd5', screen: 'TeacherAnnouncements' },
];

export default function TeacherHomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const classes = user?.assignedClasses || [];

  const fetchData = useCallback(async () => {
    try {
      const [activitiesRes, announcementsRes] = await Promise.all([
        api.get('/activities/my'),
        api.get('/announcements/my'),
      ]);
      const activities = activitiesRes.data.activities || activitiesRes.data || [];
      setRecentActivities(activities.slice(0, 4));
      const announcements = announcementsRes.data.announcements || announcementsRes.data || [];
      setRecentAnnouncements(announcements.slice(0, 2));
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(() => { setRefreshing(true); fetchData(); }, [fetchData]);

  if (loading) return <LoadingScreen />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2563eb' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#2563eb" />
      <ScrollView
        style={{ flex: 1, backgroundColor: '#f7f8ff' }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" colors={['#2563eb']} />}
      >
        {/* ── Hero Header ── */}
        <View style={{ backgroundColor: '#2563eb', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -20, right: -20, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.07)' }} />
          <View style={{ position: 'absolute', bottom: -30, left: -10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)' }} />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name="school" size={20} color="#fff" />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' }}>Kohsha Academy</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ position: 'relative' }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="notifications" size={20} color="#fff" />
              </View>
              {unreadCount > 0 && (
                <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor: '#ef4444', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#2563eb' }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{greeting()} 👋</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 2 }}>Ms. {firstName}!</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>
            {classes.length > 0 ? `Teaching ${classes.length} class${classes.length > 1 ? 'es' : ''} today` : 'Welcome to your dashboard'}
          </Text>
        </View>

        {/* ── Stats Row ── */}
        <View style={{ flexDirection: 'row', marginTop: -22, marginHorizontal: 16, gap: 10 }}>
          {[
            { icon: 'school', label: 'My Classes', value: classes.length.toString(), color: '#2563eb', bg: '#dbeafe' },
            { icon: 'book', label: 'Activities', value: recentActivities.length.toString(), color: '#7c3aed', bg: '#ede9fe' },
            { icon: 'megaphone', label: 'Updates', value: recentAnnouncements.length.toString(), color: '#ea580c', bg: '#ffedd5' },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: stat.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <Ionicons name={stat.icon} size={18} color={stat.color} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1f2937' }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: '#6b7280', fontWeight: '500', marginTop: 1 }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ padding: 16, paddingTop: 20 }}>
          {/* ── Quick Actions ── */}
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>Quick Access</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => action.tab ? navigation.getParent()?.navigate(action.tab) : navigation.navigate(action.screen)}
                style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, paddingVertical: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
                activeOpacity={0.7}
              >
                <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: action.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Ionicons name={action.icon} size={22} color={action.color} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#374151' }}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── My Classes ── */}
          {classes.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 12 }}>My Classes</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {classes.map((cls, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => navigation.getParent()?.navigate('Students', { screen: 'TeacherStudentsMain', params: { className: cls.className, section: cls.section } })}
                    activeOpacity={0.7}
                    style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2, minWidth: 150 }}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Ionicons name="school" size={20} color="#2563eb" />
                    </View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>{cls.className}</Text>
                      <Text style={{ fontSize: 11, color: '#6b7280' }}>Section {cls.section}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── Recent Activities ── */}
          {recentActivities.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>Recent Activities</Text>
                <TouchableOpacity onPress={() => navigation.getParent()?.navigate('Activities')}>
                  <Text style={{ fontSize: 12, color: '#7c3aed', fontWeight: '600' }}>View All</Text>
                </TouchableOpacity>
              </View>
              {recentActivities.map((activity) => (
                <TouchableOpacity
                  key={activity._id}
                  onPress={() => navigation.navigate('ActivityDetail', { activity })}
                  activeOpacity={0.7}
                  style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
                >
                  <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Ionicons name="document-text" size={20} color="#7c3aed" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#1f2937' }} numberOfLines={1}>{activity.title}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{activity.className} • {activity.type?.replace(/_/g, ' ')}</Text>
                  </View>
                  {activity.dueDate && (
                    <View style={{ backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', fontWeight: '500' }}>
                        {new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Calendar Banner ── */}
          <TouchableOpacity
            onPress={() => navigation.getParent()?.navigate('Calendar')}
            activeOpacity={0.8}
            style={{ backgroundColor: '#2563eb', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Stay on track!</Text>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 2 }}>View School Calendar</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 4 }}>Events, holidays & schedules</Text>
            </View>
            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="calendar" size={26} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
