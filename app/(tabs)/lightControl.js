import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { LightSensor } from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import * as Brightness from 'expo-brightness'; // Expo managed workflow

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const LightControl = () => {
  const [lightLevel, setLightLevel] = useState(0);
  const [brightness, setBrightness] = useState(1); // Default brightness level

  useEffect(() => {
    const subscription = LightSensor.addListener(sensorData => {
      const light = sensorData.illuminance;
      console.log(`Received light level: ${light} lux`); // Log raw light level

      if (light === 0) {
        console.log('Light level is zero, check your light source or sensor.');
      }

      setLightLevel(light);

      // Adjust app brightness based on light level
      let newBrightness;
      if (light < 50) {
        newBrightness = 0.3; // Dimmed brightness
        sendNotification('Dark environment detected, decreasing app brightness.');
      } else if (light > 200) {
        newBrightness = 1; // Full brightness
        sendNotification('Bright environment detected, increasing app brightness.');
      } else {
        newBrightness = Math.max(0.3, Math.min(1, light / 500));
        sendNotification(`Adjusting app brightness to ${Math.round(newBrightness * 100)}%.`);
      }

      setBrightness(newBrightness);

      // Adjust screen brightness
      if (Platform.OS === 'ios') {
        Brightness.setBrightnessAsync(newBrightness)
          .then(() => console.log(`iOS: Brightness set to ${newBrightness}`))
          .catch(error => console.error('Error setting brightness:', error));
      } else if (Platform.OS === 'android') {
        Brightness.setBrightnessAsync(newBrightness)
          .then(() => console.log(`Android: Brightness set to ${newBrightness}`))
          .catch(error => console.error('Error setting brightness:', error));
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const sendNotification = async (message) => {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Light Level Alert',
        body: message,
      },
      trigger: null, // Trigger immediately
    });

    console.log(`Notification scheduled with ID: ${notificationId}`);
  };

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#fff',
  },
});

export default LightControl;
