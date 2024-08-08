import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';

// Request notification permissions
Notifications.requestPermissionsAsync();

const LiftDetector = () => {
  const [liftCount, setLiftCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [lastZ, setLastZ] = useState(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(100); // Update every 100ms

    const subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const now = Date.now();

      // Calculate acceleration magnitude
      const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      // Detect significant upward movement (lift)
      if (now - lastUpdate > 500) {
        if (z > lastZ + 1.5) { // Threshold for detecting a lift
          setLastUpdate(now);
          setLastZ(z);
          
          setLiftCount(prevCount => {
            const newCount = prevCount + 1;
            
            // If three lifts are detected, send a notification
            if (newCount >= 2) {
              sendNotification('CTU altered!');
              return 0; // Reset the count after sending notification
            }
            
            return newCount;
          });
        }
      }

      // Update lastZ value
      setLastZ(z);
    });

    return () => subscription.remove();
  }, [lastUpdate, lastZ]);

  // Function to send notifications
  const sendNotification = async (message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lift Detected',
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

export default LiftDetector;
