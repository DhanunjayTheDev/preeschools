import './src/global.css';
import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import AppNavigator from './src/navigation/AppNavigator';
import useAuthStore from './src/stores/authStore';
import useNotificationStore from './src/stores/notificationStore';
import {
  registerForPushNotifications,
  savePushTokenToServer,
  setBadgeCount,
} from './src/services/notifications';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { initialize, user, token } = useAuthStore();
  const { addNotification, fetchNotifications } = useNotificationStore();
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigationRef = useRef();

  // Initialize auth state on mount
  useEffect(() => {
    const init = async () => {
      await initialize();
      await SplashScreen.hideAsync();
    };
    init();
  }, []);

  // Register push notifications when authenticated
  useEffect(() => {
    if (token && user) {
      const setupPush = async () => {
        try {
          const pushToken = await registerForPushNotifications();
          if (pushToken) {
            await savePushTokenToServer(pushToken);
          }
        } catch (error) {
          // Push notifications not available in Expo Go - skip setup
          console.log('Push notifications not available:', error.message);
        }
      };
      setupPush();
      fetchNotifications(1);
    }
  }, [token, user]);

  // Listen for incoming notifications
  useEffect(() => {
    // Foreground notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body, data } = notification.request.content;
      addNotification({
        _id: notification.request.identifier,
        title,
        message: body,
        type: data?.type || 'SYSTEM',
        isRead: false,
        createdAt: new Date().toISOString(),
        metadata: data,
      });
    });

    // Notification tap handler
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (navigationRef.current) {
        if (data?.type === 'ANNOUNCEMENT') {
          navigationRef.current.navigate('AnnouncementDetail', { announcementId: data.announcementId });
        } else if (data?.type === 'FEE') {
          navigationRef.current.navigate('Fees');
        } else if (data?.type === 'ACTIVITY') {
          navigationRef.current.navigate('ActivityDetail', { activityId: data.activityId });
        }
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  // Reset badge on app open
  useEffect(() => {
    setBadgeCount(0);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
