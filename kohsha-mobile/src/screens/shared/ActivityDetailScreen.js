import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../../components/ui';
import api from '../../lib/api';
import { API_BASE_URL } from '../../config';

const typeConfig = {
  HOMEWORK: { icon: 'book', color: '#7c3aed', bg: '#7c3aed' },
  CLASS_ACTIVITY: { icon: 'people', color: '#2563eb', bg: '#2563eb' },
  PROJECT: { icon: 'construct', color: '#059669', bg: '#059669' },
};

export default function ActivityDetailScreen({ route, navigation }) {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f7ff' }} edges={['top']}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6b7280' }}>Activity not found</Text>
      </View>
    </SafeAreaView>
  );

  const tc = typeConfig[activity.type] || typeConfig.HOMEWORK;
  const isOverdue = activity.dueDate && new Date(activity.dueDate) < new Date();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tc.bg }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={tc.bg} />

      {/* Hero Header */}
      <View style={{ backgroundColor: tc.bg, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -20, right: -10, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {activity.type?.replace('_', ' ')}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{activity.className}</Text>
          </View>
          {isOverdue && (
            <View style={{ backgroundColor: '#ef4444', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>OVERDUE</Text>
            </View>
          )}
        </View>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 26 }}>{activity.title}</Text>
        {activity.dueDate && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.75)" />
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginLeft: 5 }}>
              Due {new Date(activity.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: '#f8f7ff' }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Description */}
        {activity.description && (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: tc.bg + '18', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name="document-text-outline" size={16} color={tc.color} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>Description</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#4b5563', lineHeight: 21 }}>{activity.description}</Text>
          </View>
        )}

        {/* Attachments */}
        {activity.attachments?.length > 0 && (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name="attach" size={16} color="#6b7280" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>Attachments ({activity.attachments.length})</Text>
            </View>
            {activity.attachments.map((attachment, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => Linking.openURL(attachment.startsWith('http') ? attachment : `${API_BASE_URL}/${attachment}`)}
                activeOpacity={0.7}
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: '#f9fafb' }}
              >
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Ionicons name="document" size={16} color="#7c3aed" />
                </View>
                <Text style={{ flex: 1, fontSize: 13, color: '#7c3aed', fontWeight: '500' }} numberOfLines={1}>{attachment.split('/').pop()}</Text>
                <Ionicons name="open-outline" size={16} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Submissions */}
        {activity.submissions?.length > 0 && (
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#d1fae5', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name="checkmark-done" size={16} color="#059669" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>Submissions ({activity.submissions.length})</Text>
            </View>
            {activity.submissions.map((sub, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: '#f9fafb' }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Ionicons name="person" size={15} color="#7c3aed" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#1f2937' }}>{sub.studentName || 'Student'}</Text>
                  <Text style={{ fontSize: 11, color: '#9ca3af' }}>
                    {new Date(sub.submittedAt || sub.createdAt).toLocaleDateString('en-IN')}
                  </Text>
                </View>
                {sub.grade && (
                  <View style={{ backgroundColor: '#d1fae5', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text style={{ color: '#059669', fontWeight: '700', fontSize: 12 }}>{sub.grade}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Meta */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 11, color: '#9ca3af' }}>
            Created {new Date(activity.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
          {activity.createdBy?.name && (
            <Text style={{ fontSize: 11, color: '#9ca3af' }}>By {activity.createdBy.name}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
