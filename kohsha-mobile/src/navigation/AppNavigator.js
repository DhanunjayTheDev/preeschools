import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

// Parent screens
import ParentHomeScreen from '../screens/parent/HomeScreen';
import ParentFeesScreen from '../screens/parent/FeesScreen';
import FeeDetailScreen from '../screens/parent/FeeDetailScreen';
import ParentActivitiesScreen from '../screens/parent/ActivitiesScreen';
import ParentAnnouncementsScreen from '../screens/parent/AnnouncementsScreen';
import ParentCalendarScreen from '../screens/parent/CalendarScreen';

// Teacher screens
import TeacherHomeScreen from '../screens/teacher/HomeScreen';
import TeacherActivitiesScreen from '../screens/teacher/ActivitiesScreen';
import CreateActivityScreen from '../screens/teacher/CreateActivityScreen';
import TeacherStudentsScreen from '../screens/teacher/StudentsScreen';

// Shared screens
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import ActivityDetailScreen from '../screens/shared/ActivityDetailScreen';
import AnnouncementDetailScreen from '../screens/shared/AnnouncementDetailScreen';
import StudentDetailScreen from '../screens/shared/StudentDetailScreen';
import ChildDetailScreen from '../screens/shared/ChildDetailScreen';

// Auth
import LoginScreen from '../screens/auth/LoginScreen';
import useAuthStore from '../stores/authStore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Shared screen options
const screenOptions = {
  headerStyle: { backgroundColor: '#fff' },
  headerTintColor: '#1f2937',
  headerTitleStyle: { fontWeight: '600', fontSize: 17 },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

// ===================== PARENT STACKS =====================

const ParentHomeStack = createNativeStackNavigator();
function ParentHomeNavigator() {
  return (
    <ParentHomeStack.Navigator screenOptions={screenOptions}>
      <ParentHomeStack.Screen name="ParentHome" component={ParentHomeScreen} options={{ headerShown: false }} />
      <ParentHomeStack.Screen name="ChildDetail" component={ChildDetailScreen} options={{ title: 'Child Details' }} />
      <ParentHomeStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <ParentHomeStack.Screen name="ParentAnnouncements" component={ParentAnnouncementsScreen} options={{ title: 'Announcements' }} />
      <ParentHomeStack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} options={{ title: 'Announcement' }} />
      <ParentHomeStack.Screen name="ActivityDetail" component={ActivityDetailScreen} options={{ title: 'Activity' }} />
    </ParentHomeStack.Navigator>
  );
}

const ParentFeesStack = createNativeStackNavigator();
function ParentFeesNavigator() {
  return (
    <ParentFeesStack.Navigator screenOptions={screenOptions}>
      <ParentFeesStack.Screen name="ParentFeesMain" component={ParentFeesScreen} options={{ headerShown: false }} />
      <ParentFeesStack.Screen name="FeeDetail" component={FeeDetailScreen} options={{ title: 'Fee Details' }} />
    </ParentFeesStack.Navigator>
  );
}

const ParentActivitiesStack = createNativeStackNavigator();
function ParentActivitiesNavigator() {
  return (
    <ParentActivitiesStack.Navigator screenOptions={screenOptions}>
      <ParentActivitiesStack.Screen name="ParentActivitiesMain" component={ParentActivitiesScreen} options={{ headerShown: false }} />
      <ParentActivitiesStack.Screen name="ActivityDetail" component={ActivityDetailScreen} options={{ title: 'Activity' }} />
    </ParentActivitiesStack.Navigator>
  );
}

const ParentCalendarStack = createNativeStackNavigator();
function ParentCalendarNavigator() {
  return (
    <ParentCalendarStack.Navigator screenOptions={screenOptions}>
      <ParentCalendarStack.Screen name="ParentCalendarMain" component={ParentCalendarScreen} options={{ headerShown: false }} />
    </ParentCalendarStack.Navigator>
  );
}

const ParentProfileStack = createNativeStackNavigator();
function ParentProfileNavigator() {
  return (
    <ParentProfileStack.Navigator screenOptions={screenOptions}>
      <ParentProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </ParentProfileStack.Navigator>
  );
}

function ParentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Fees: focused ? 'wallet' : 'wallet-outline',
            Activities: focused ? 'book' : 'book-outline',
            Calendar: focused ? 'calendar' : 'calendar-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={ParentHomeNavigator} />
      <Tab.Screen name="Fees" component={ParentFeesNavigator} />
      <Tab.Screen name="Activities" component={ParentActivitiesNavigator} />
      <Tab.Screen name="Calendar" component={ParentCalendarNavigator} />
      <Tab.Screen name="Profile" component={ParentProfileNavigator} />
    </Tab.Navigator>
  );
}

// ===================== TEACHER STACKS =====================

const TeacherHomeStack = createNativeStackNavigator();
function TeacherHomeNavigator() {
  return (
    <TeacherHomeStack.Navigator screenOptions={screenOptions}>
      <TeacherHomeStack.Screen name="TeacherHome" component={TeacherHomeScreen} options={{ headerShown: false }} />
      <TeacherHomeStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
      <TeacherHomeStack.Screen name="TeacherAnnouncements" component={ParentAnnouncementsScreen} options={{ title: 'Announcements' }} />
      <TeacherHomeStack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} options={{ title: 'Announcement' }} />
      <TeacherHomeStack.Screen name="ActivityDetail" component={ActivityDetailScreen} options={{ title: 'Activity' }} />
      <TeacherHomeStack.Screen name="StudentDetail" component={StudentDetailScreen} options={{ title: 'Student Details' }} />
    </TeacherHomeStack.Navigator>
  );
}

const TeacherActivitiesStack = createNativeStackNavigator();
function TeacherActivitiesNavigator() {
  return (
    <TeacherActivitiesStack.Navigator screenOptions={screenOptions}>
      <TeacherActivitiesStack.Screen name="TeacherActivitiesMain" component={TeacherActivitiesScreen} options={{ headerShown: false }} />
      <TeacherActivitiesStack.Screen name="CreateActivity" component={CreateActivityScreen} options={{ title: 'New Activity' }} />
      <TeacherActivitiesStack.Screen name="ActivityDetail" component={ActivityDetailScreen} options={{ title: 'Activity' }} />
    </TeacherActivitiesStack.Navigator>
  );
}

const TeacherStudentsStack = createNativeStackNavigator();
function TeacherStudentsNavigator() {
  return (
    <TeacherStudentsStack.Navigator screenOptions={screenOptions}>
      <TeacherStudentsStack.Screen name="TeacherStudentsMain" component={TeacherStudentsScreen} options={{ headerShown: false }} />
      <TeacherStudentsStack.Screen name="StudentDetail" component={StudentDetailScreen} options={{ title: 'Student Details' }} />
    </TeacherStudentsStack.Navigator>
  );
}

const TeacherCalendarStack = createNativeStackNavigator();
function TeacherCalendarNavigator() {
  return (
    <TeacherCalendarStack.Navigator screenOptions={screenOptions}>
      <TeacherCalendarStack.Screen name="TeacherCalendarMain" component={ParentCalendarScreen} options={{ headerShown: false }} />
    </TeacherCalendarStack.Navigator>
  );
}

const TeacherProfileStack = createNativeStackNavigator();
function TeacherProfileNavigator() {
  return (
    <TeacherProfileStack.Navigator screenOptions={screenOptions}>
      <TeacherProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </TeacherProfileStack.Navigator>
  );
}

function TeacherTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Activities: focused ? 'book' : 'book-outline',
            Students: focused ? 'people' : 'people-outline',
            Calendar: focused ? 'calendar' : 'calendar-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={TeacherHomeNavigator} />
      <Tab.Screen name="Activities" component={TeacherActivitiesNavigator} />
      <Tab.Screen name="Students" component={TeacherStudentsNavigator} />
      <Tab.Screen name="Calendar" component={TeacherCalendarNavigator} />
      <Tab.Screen name="Profile" component={TeacherProfileNavigator} />
    </Tab.Navigator>
  );
}

// ===================== MAIN NAVIGATOR =====================

export default function AppNavigator() {
  const { user, token } = useAuthStore();
  const isAuthenticated = !!token && !!user;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ animationTypeForReplace: 'pop' }} />
      ) : user.role === 'TEACHER' ? (
        <Stack.Screen name="TeacherApp" component={TeacherTabs} />
      ) : (
        <Stack.Screen name="ParentApp" component={ParentTabs} />
      )}
    </Stack.Navigator>
  );
}
