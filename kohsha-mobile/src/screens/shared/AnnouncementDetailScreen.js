import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../components/ui';
import api from '../../lib/api';

const typeConfig = {
  GENERAL: { icon: 'megaphone', color: '#7c3aed', heroBg: '#7c3aed' },
  EVENT: { icon: 'calendar', color: '#2563eb', heroBg: '#2563eb' },
  HOLIDAY: { icon: 'sunny', color: '#ea580c', heroBg: '#ea580c' },
  EMERGENCY: { icon: 'warning', color: '#dc2626', heroBg: '#dc2626' },
};

export default function AnnouncementDetailScreen({ route, navigation }) {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f7ff' }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6b7280' }}>Announcement not found</Text>
      </View>
    </SafeAreaView>
  );

  const tc = typeConfig[announcement.type] || typeConfig.GENERAL;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tc.heroBg }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={tc.heroBg} />

      {/* Hero */}
      <View style={{ backgroundColor: tc.heroBg, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 30, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -20, right: -10, width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
          <Ionicons name={tc.icon} size={22} color="#fff" />
        </View>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>{announcement.type}</Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 26 }}>{announcement.title}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 6 }}>
          {new Date(announcement.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#f8f7ff' }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Message */}
        <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: tc.heroBg + '18', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={tc.color} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>Message</Text>
          </View>
          <Text style={{ fontSize: 14, color: '#4b5563', lineHeight: 22 }}>{announcement.message}</Text>
        </View>

        {/* Audience */}
        {(announcement.targetClasses?.length > 0 || announcement.targetRole) && (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name="people-outline" size={16} color="#6b7280" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>Target Audience</Text>
            </View>
            {announcement.targetRole && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#6b7280" />
                <Text style={{ fontSize: 13, color: '#4b5563', marginLeft: 8, textTransform: 'capitalize' }}>{announcement.targetRole}</Text>
              </View>
            )}
            {announcement.targetClasses?.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {announcement.targetClasses.map((cls, idx) => (
                  <View key={idx} style={{ backgroundColor: '#f3f4f6', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ fontSize: 12, color: '#374151', fontWeight: '500' }}>{cls}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        {announcement.createdBy?.name && (
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 }}>
            <Ionicons name="person-outline" size={12} color="#9ca3af" />
            <Text style={{ fontSize: 11, color: '#9ca3af', marginLeft: 5 }}>Posted by {announcement.createdBy.name}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
