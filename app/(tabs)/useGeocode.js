import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

async function requestPermissions() {
  const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
  const { status: notificationStatus } = await Notifications.requestPermissionsAsync();

  if (locationStatus !== 'granted') {
    alert('Location permission is required to track your location.');
  }
  if (notificationStatus !== 'granted') {
    alert('Notification permission is required to receive alerts.');
  }
}

requestPermissions();
