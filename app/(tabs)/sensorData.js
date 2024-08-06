import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import VirtualIndicators from './VirtualIndictor';

const SensorData = () => {
  const [data, setData] = useState([{ value: 0 }]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newValue = Math.random() * 100; // Simulate new sensor data
        return [...prevData.slice(-19), { value: newValue }];
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <VirtualIndicators data={data} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SensorData;
