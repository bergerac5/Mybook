import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';

// Request notification permissions
Notifications.requestPermissionsAsync();

const ShakeDetector = () => {
  const [shakeCount, setShakeCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    Accelerometer.setUpdateInterval(100); // Update every 100ms

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const now = Date.now();

      // Calculate acceleration magnitude
      const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      // Check if it's a shake
      if (magnitude > 2.5 && now - lastUpdate > 500) {
        // If detected shake, update last shake time
        setLastUpdate(now);
        setShakeCount(prevCount => {
          const newCount = prevCount + 1;
          
          // If three shakes are detected, send a notification
          if (newCount >= 3) {
            sendNotification('CTU altered!');
            return 0; // Reset the count after sending notification
          }
          
          return newCount;
        });
      }
    });

    return () => subscription.remove();
  }, [lastUpdate]);

  // Function to send notifications
  const sendNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Shake Detected',
        body: message,
      },
      trigger: null,
    });
  };

  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default ShakeDetector;
