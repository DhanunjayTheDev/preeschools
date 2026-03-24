import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

// Register for push notifications and get the Expo push token
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Push notifications not supported in Expo Go (SDK 53+)
  // Use executionEnvironment for SDK 54+ (appOwnership is deprecated)
  const isExpoGo =
    Constants.executionEnvironment === 'storeClient' ||
    Constants.appOwnership === 'expo';
  if (isExpoGo) {
    console.log('Push notifications not supported in Expo Go - use a development build');
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Push notification permission not granted');
    return null;
  }

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7c3aed',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('announcements', {
      name: 'Announcements',
      description: 'School announcements and updates',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('fees', {
      name: 'Fee Reminders',
      description: 'Fee payment reminders and receipts',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('activities', {
      name: 'Activities',
      description: 'Activity and homework updates',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  try {
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId;
    if (!projectId) {
      console.log('No projectId configured - push notifications skipped');
      return null;
    }
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenData.data;
  } catch (error) {
    console.log('Push token not available:', error.message);
    return null;
  }
}

// Save push token to server
export async function savePushTokenToServer(pushToken) {
  try {
    const stored = await AsyncStorage.getItem('kohsha_push_token');
    if (stored === pushToken) return; // Already saved

    await api.post('/auth/push-token', { pushToken, platform: Platform.OS });
    await AsyncStorage.setItem('kohsha_push_token', pushToken);
  } catch (error) {
    console.error('Error saving push token:', error);
  }
}

// Remove push token on logout
export async function removePushToken() {
  try {
    const pushToken = await AsyncStorage.getItem('kohsha_push_token');
    if (pushToken) {
      await api.delete('/auth/push-token', { data: { pushToken } });
      await AsyncStorage.removeItem('kohsha_push_token');
    }
  } catch (error) {
    console.error('Error removing push token:', error);
  }
}

// Schedule a local notification
export async function scheduleLocalNotification(title, body, data = {}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: 'default',
    },
    trigger: null, // Immediately
  });
}

// Get badge count
export async function getBadgeCount() {
  return await Notifications.getBadgeCountAsync();
}

// Set badge count
export async function setBadgeCount(count) {
  await Notifications.setBadgeCountAsync(count);
}
