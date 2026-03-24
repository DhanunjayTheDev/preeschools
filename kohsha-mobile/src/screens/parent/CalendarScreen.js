import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Card, LoadingScreen, EmptyState } from '../../components/ui';
import api from '../../lib/api';

const typeColors = {
  HOLIDAY: '#16a34a',
  EVENT: '#2563eb',
  EXAM: '#dc2626',
  ACTIVITY: '#7c3aed',
};

const typeIcons = {
  HOLIDAY: 'sunny',
  EVENT: 'calendar',
  EXAM: 'document-text',
  ACTIVITY: 'basketball',
};

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await api.get('/calendar', {
        params: { month: currentMonth, year: currentYear },
      });
      setEvents(data.events || data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  const monthName = new Date(currentYear, currentMonth - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const navigateMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setLoading(true);
  };

  if (loading) return <LoadingScreen />;

  // Group events by date
  const grouped = events.reduce((acc, event) => {
    const dateKey = new Date(event.startDate).toLocaleDateString('en-IN');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <View className="px-5 pt-4 pb-6">
        {/* Month navigation */}
        <View className="flex-row items-center justify-between mb-5">
          <Ionicons name="chevron-back" size={24} color="#7c3aed" onPress={() => navigateMonth(-1)} />
          <Text className="text-xl font-bold text-gray-900">{monthName}</Text>
          <Ionicons name="chevron-forward" size={24} color="#7c3aed" onPress={() => navigateMonth(1)} />
        </View>

        {/* Legend */}
        <View className="flex-row flex-wrap gap-3 mb-4">
          {Object.entries(typeColors).map(([type, color]) => (
            <View key={type} className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: color }} />
              <Text className="text-xs text-gray-500">{type}</Text>
            </View>
          ))}
        </View>

        {/* Events */}
        {Object.keys(grouped).length === 0 ? (
          <EmptyState icon="calendar-outline" title="No Events" message="No events scheduled for this month" />
        ) : (
          Object.entries(grouped).map(([date, dayEvents]) => (
            <View key={date} className="mb-4">
              <Text className="text-xs font-bold text-gray-500 uppercase mb-2">{date}</Text>
              {dayEvents.map((event) => {
                const color = typeColors[event.type] || '#6b7280';
                return (
                  <Card key={event._id} className="mb-2">
                    <View className="flex-row items-center">
                      <View className="w-1 h-10 rounded-full mr-3" style={{ backgroundColor: color }} />
                      <View className="w-9 h-9 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: color + '15' }}>
                        <Ionicons name={typeIcons[event.type] || 'calendar'} size={18} color={color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold text-gray-900">{event.title}</Text>
                        {event.description && (
                          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>{event.description}</Text>
                        )}
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          ))
        )}
      </View>
    </Screen>
  );
}
