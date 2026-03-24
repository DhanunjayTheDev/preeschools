import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../lib/api';

const typeConfig = {
  GENERAL: { icon: 'megaphone', color: '#7c3aed', bg: '#ede9fe' },
  ACADEMIC: { icon: 'school', color: '#2563eb', bg: '#dbeafe' },
  EVENT: { icon: 'calendar', color: '#2563eb', bg: '#dbeafe' },
  HOLIDAY: { icon: 'sunny', color: '#f59e0b', bg: '#fef3c7' },
  EMERGENCY: { icon: 'warning', color: '#ef4444', bg: '#fee2e2' },
};

export default function AnnouncementsScreen({ navigation, route }) {
  const canGoBack = navigation.canGoBack();
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
  const onRefresh = useCallback(() => { setRefreshing(true); fetchAnnouncements(); }, [fetchAnnouncements]);

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
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase' }}>School Updates</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 6 }}>Announcements</Text>
          {announcements.length > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' }}>
              <Ionicons name="list" size={14} color="#fff" style={{ marginRight: 6 }} />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{announcements.length} total</Text>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: '#fafafa' }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
        >
          {announcements.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Ionicons name="megaphone-outline" size={40} color="#9ca3af" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937', marginBottom: 6 }}>No Announcements</Text>
              <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>No announcements available at this time. Check back soon!</Text>
            </View>
          ) : (
            announcements.map((item, idx) => {
              const tc = typeConfig[item.type] || typeConfig.GENERAL;
              return (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
                  activeOpacity={0.7}
                  style={{ 
                    backgroundColor: '#fff', 
                    borderRadius: 18, 
                    padding: 16, 
                    marginBottom: 12, 
                    borderLeftWidth: 4,
                    borderLeftColor: tc.color,
                    shadowColor: '#000', 
                    shadowOpacity: 0.05, 
                    shadowRadius: 8, 
                    shadowOffset: { width: 0, height: 2 }, 
                    elevation: 2 
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: tc.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
                      <Ionicons name={tc.icon} size={24} color={tc.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937', flex: 1, marginRight: 8 }} numberOfLines={1}>{item.title}</Text>
                        {idx === 0 && (
                          <View style={{ backgroundColor: tc.color, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>New</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ fontSize: 13, color: '#6b7280', lineHeight: 18 }} numberOfLines={3}>{item.message || item.content}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                        <View style={{ backgroundColor: tc.bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: tc.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.type}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: '#9ca3af', fontWeight: '500' }}>
                          {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
