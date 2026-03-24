import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import api from '../../lib/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_SIZE = Math.floor((SCREEN_WIDTH - 32 - 12) / 7); // 7 cols, 16px padding each side, 12px gap

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

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function MonthGrid({ year, month, events, selectedDay, onSelectDay }) {
  const today = new Date();
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();

  // Map event dates to day numbers for quick lookup
  const eventDayMap = {};
  events.forEach(event => {
    const d = new Date(event.startDate);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      const day = d.getDate();
      if (!eventDayMap[day]) eventDayMap[day] = [];
      const color = typeColors[event.type] || '#6b7280';
      if (!eventDayMap[day].includes(color)) eventDayMap[day].push(color);
    }
  });

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();
  const isSelected = (d) => d === selectedDay;

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return (
    <View>
      {/* Week day headers */}
      <View style={{ flexDirection: 'row', marginBottom: 6 }}>
        {WEEK_DAYS.map(day => (
          <View key={day} style={{ width: DAY_SIZE, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase' }}>{day}</Text>
          </View>
        ))}
      </View>
      {/* Day grid */}
      {rows.map((row, rIdx) => (
        <View key={rIdx} style={{ flexDirection: 'row', marginBottom: 4 }}>
          {row.map((day, cIdx) => {
            if (!day) return <View key={cIdx} style={{ width: DAY_SIZE, height: DAY_SIZE }} />;
            const dots = eventDayMap[day] || [];
            const today_ = isToday(day);
            const selected = isSelected(day);
            return (
              <TouchableOpacity
                key={cIdx}
                onPress={() => onSelectDay(selected ? null : day)}
                style={{ width: DAY_SIZE, height: DAY_SIZE, alignItems: 'center', justifyContent: 'center' }}
              >
                <View style={{
                  width: 34, height: 34, borderRadius: 17,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: selected ? '#7c3aed' : today_ ? '#ede9fe' : 'transparent',
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: today_ || selected ? '800' : '500',
                    color: selected ? '#fff' : today_ ? '#7c3aed' : '#1f2937',
                  }}>{day}</Text>
                </View>
                {dots.length > 0 && (
                  <View style={{ flexDirection: 'row', marginTop: 2, gap: 2 }}>
                    {dots.slice(0, 3).map((c, i) => (
                      <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: selected ? '#fff' : c }} />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

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
    setSelectedDay(null);
    setLoading(true);
  };

  // Filter events: if a day is selected show only that day's events, else show all
  const filteredEvents = selectedDay
    ? events.filter(e => {
        const d = new Date(e.startDate);
        return d.getDate() === selectedDay && d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
      })
    : events;

  const grouped = filteredEvents.reduce((acc, event) => {
    const dateKey = new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {});

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#7c3aed' }} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#7c3aed" />

      {/* Hero Header */}
      <View style={{ backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}>Schedule</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 2 }}>{monthName}</Text>
          </View>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, backgroundColor: '#f5f5f5' }}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar Grid Card */}
          <View style={{ backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 3 }}>
            <MonthGrid
              year={currentYear}
              month={currentMonth}
              events={events}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </View>

          {/* Legend */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginHorizontal: 16, marginTop: 12 }}>
            {Object.entries(typeColors).map(([type, color]) => (
              <View key={type} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 5 }} />
                <Text style={{ fontSize: 11, color: '#6b7280', fontWeight: '600' }}>{type}</Text>
              </View>
            ))}
          </View>

          {/* Events section header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 20, marginBottom: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1f2937' }}>
              {selectedDay ? `Events on ${selectedDay} ${new Date(currentYear, currentMonth - 1).toLocaleDateString('en-IN', { month: 'long' })}` : 'All Events'}
            </Text>
            {selectedDay && (
              <TouchableOpacity onPress={() => setSelectedDay(null)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ede9fe', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                <Ionicons name="close" size={13} color="#7c3aed" style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 12, color: '#7c3aed', fontWeight: '600' }}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Events List */}
          <View style={{ paddingHorizontal: 16 }}>
            {Object.keys(grouped).length === 0 ? (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#ede9fe', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Ionicons name="calendar-outline" size={32} color="#7c3aed" />
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937', marginBottom: 4 }}>No Events</Text>
                <Text style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
                  {selectedDay ? 'No events on this day' : 'No events scheduled for this month'}
                </Text>
              </View>
            ) : (
              Object.entries(grouped).map(([date, dayEvents]) => (
                <View key={date} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 3, height: 16, backgroundColor: '#7c3aed', borderRadius: 2, marginRight: 8 }} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{date}</Text>
                  </View>

                  {dayEvents.map((event, idx) => {
                    const color = typeColors[event.type] || '#6b7280';
                    return (
                      <View
                        key={`${event._id ?? idx}_${idx}`}
                        style={{
                          backgroundColor: '#fff',
                          borderRadius: 14,
                          padding: 12,
                          marginBottom: 8,
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          borderLeftWidth: 4,
                          borderLeftColor: color,
                          shadowColor: '#000',
                          shadowOpacity: 0.04,
                          shadowRadius: 5,
                          shadowOffset: { width: 0, height: 2 },
                          elevation: 2,
                        }}
                      >
                        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: color + '15', alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 }}>
                          <Ionicons name={typeIcons[event.type] || 'calendar'} size={18} color={color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>{event.title}</Text>
                          {event.description && (
                            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 3, lineHeight: 16 }} numberOfLines={2}>{event.description}</Text>
                          )}
                          <View style={{ paddingHorizontal: 7, paddingVertical: 3, backgroundColor: color + '12', borderRadius: 6, alignSelf: 'flex-start', marginTop: 6 }}>
                            <Text style={{ fontSize: 10, color: color, fontWeight: '700', textTransform: 'uppercase' }}>{event.type}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))
            )}
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
