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
  const [lastLightLevel, setLastLightLevel] = useState(0);

  useEffect(() => {
    const subscription = LightSensor.addListener(sensorData => {
      const light = sensorData.illuminance;
      console.log(`Received light level: ${light} lux`); // Log raw light level

      setLightLevel(light);

      let newBrightness = brightness; // Use current brightness as default
      let notificationMessage;

      if (light < 50 && lastLightLevel >= 50) {
        newBrightness = 0.3; // Dimmed brightness
        notificationMessage = 'Dark environment detected, decreasing app brightness.';
      } else if (light > 200 && lastLightLevel <= 200) {
        newBrightness = 1; // Full brightness
        notificationMessage = 'Bright environment detected, increasing app brightness.';
      }

      newBrightness = Math.max(0, Math.min(1, newBrightness)); // Ensure brightness is within range

      setBrightness(newBrightness);

      if (notificationMessage) {
        sendNotification(notificationMessage);
      }

      Brightness.setBrightnessAsync(newBrightness)
        .then(() => console.log(`Brightness set to ${newBrightness}`))
        .catch(error => console.error('Error setting brightness:', error));

      setLastLightLevel(light);
    });

    return () => {
      subscription.remove();
    };
  }, [lastLightLevel, brightness]);

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

  return null;
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
