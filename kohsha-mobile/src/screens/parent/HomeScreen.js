import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Badge, LoadingScreen } from '../../components/ui';
import useAuthStore from '../../stores/authStore';
import useNotificationStore from '../../stores/notificationStore';
import api from '../../lib/api';

const quickActions = [
  { id: 'fees', icon: 'wallet', label: 'Fees', color: '#10b981', bg: '#d1fae5', tab: 'Fees' },
  { id: 'activities', icon: 'book', label: 'Activities', color: '#3b82f6', bg: '#dbeafe', tab: 'Activities' },
  { id: 'calendar', icon: 'calendar', label: 'Calendar', color: '#f59e0b', bg: '#fef3c7', tab: 'Calendar' },
  { id: 'updates', icon: 'megaphone', label: 'Updates', color: '#ef4444', bg: '#fee2e2', screen: 'ParentAnnouncements' },
];

const announcementTypeIcon = { GENERAL: 'information-circle', EVENT: 'calendar', HOLIDAY: 'sunny', EMERGENCY: 'warning', ACADEMIC: 'school' };
const announcementTypeColor = { GENERAL: '#7c3aed', EVENT: '#2563eb', HOLIDAY: '#f59e0b', EMERGENCY: '#ef4444', ACADEMIC: '#10b981' };

export default function ParentHomeScreen({ navigation }) {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [children, setChildren] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [pendingFees, setPendingFees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [childrenRes, announcementsRes, feesRes] = await Promise.all([
        api.get('/students/my-children'),
        api.get('/announcements/my'),
        api.get('/fees/my-fees').catch(() => ({ data: { studentFees: [] } })),
      ]);
      setChildren(childrenRes.data.students || childrenRes.data || []);
      const announcements = announcementsRes.data.announcements || announcementsRes.data || [];
      setRecentAnnouncements(announcements.slice(0, 3));

      // Calculate pending amount
      const studentFees = feesRes.data?.studentFees || [];
      const due = studentFees.flatMap(sf => sf.fees || []).reduce((sum, f) => sum + (f.dueAmount || 0), 0);
      setPendingFees(due);
    } catch (error) {
      console.error('Error fetching parent data:', error);
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

  const firstName = user?.name?.split(' ')[0] || 'Parent';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7c3aed' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />
      <ScrollView
        style={{ flex: 1, backgroundColor: '#f8f7ff' }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" colors={['#7c3aed']} />}
      >
        {/* ── Hero Header ── */}
        <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden' }}>
          {/* Decorative circles */}
          <View style={{ position: 'absolute', top: -20, right: -20, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.07)' }} />
          <View style={{ position: 'absolute', bottom: -30, left: -10, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)' }} />
          <View style={{ position: 'absolute', top: 10, right: 60, width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.06)' }} />

          {/* Top row */}
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
                <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor: '#ef4444', borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#7c3aed' }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{greeting()} 👋</Text>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 2 }}>{firstName}!</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 }}>Stay updated with your child's progress</Text>
        </View>

        {/* ── Stats Row ── */}
        <View style={{ flexDirection: 'row', marginTop: -22, marginHorizontal: 16, gap: 10 }}>
          {[
            { icon: 'people', label: 'Children', value: children.length.toString(), color: '#7c3aed', bg: '#ede9fe' },
            { icon: 'wallet', label: 'Fee Due', value: pendingFees > 0 ? `₹${(pendingFees/1000).toFixed(0)}K` : '₹0', color: pendingFees > 0 ? '#ef4444' : '#10b981', bg: pendingFees > 0 ? '#fee2e2' : '#d1fae5' },
            { icon: 'megaphone', label: 'Updates', value: recentAnnouncements.length.toString(), color: '#f59e0b', bg: '#fef3c7' },
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>Quick Access</Text>
          </View>
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

          {/* ── My Children ── */}
          {children.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>My Children</Text>
                <Text style={{ fontSize: 12, color: '#7c3aed', fontWeight: '600' }}>{children.length} enrolled</Text>
              </View>
              {children.map((child) => (
                <TouchableOpacity
                  key={child._id}
                  onPress={() => navigation.navigate('ChildDetail', { child })}
                  activeOpacity={0.7}
                  style={{ backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
                >
                  <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#7c3aed' }}>{child.name?.charAt(0)?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>{child.name}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{child.className} • Section {child.section}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <View style={{ backgroundColor: child.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: child.status === 'ACTIVE' ? '#059669' : '#d97706' }}>{child.status}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#9ca3af" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Recent Announcements ── */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937' }}>Recent Updates</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ParentAnnouncements')}>
                <Text style={{ fontSize: 12, color: '#7c3aed', fontWeight: '600' }}>View All</Text>
              </TouchableOpacity>
            </View>

            {recentAnnouncements.length === 0 ? (
              <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 24, alignItems: 'center' }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Ionicons name="megaphone-outline" size={24} color="#7c3aed" />
                </View>
                <Text style={{ color: '#6b7280', fontSize: 13 }}>No recent announcements</Text>
              </View>
            ) : (
              recentAnnouncements.map((item, idx) => {
                const iconName = announcementTypeIcon[item.type] || 'information-circle';
                const iconColor = announcementTypeColor[item.type] || '#7c3aed';
                return (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
                    activeOpacity={0.7}
                    style={{ backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-start', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
                  >
                    <View style={{ width: 42, height: 42, borderRadius: 13, backgroundColor: iconColor + '15', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Ionicons name={iconName} size={20} color={iconColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }} numberOfLines={1}>{item.title}</Text>
                      <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 3, lineHeight: 17 }} numberOfLines={2}>{item.message || item.content}</Text>
                      <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 5 }}>
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                    {idx === 0 && (
                      <View style={{ backgroundColor: '#7c3aed', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 }}>
                        <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>NEW</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* ── School Info Banner ── */}
          <TouchableOpacity
            onPress={() => navigation.getParent()?.navigate('Calendar')}
            activeOpacity={0.8}
            style={{ backgroundColor: '#7c3aed', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>Don't miss out!</Text>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', marginTop: 2 }}>View School Calendar</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 4 }}>Upcoming events, holidays & more</Text>
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
