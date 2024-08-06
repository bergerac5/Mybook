import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

const VirtualIndicators = ({ data }) => {
  const width = 300;
  const height = 200;
  const margin = 20;
  const indicatorRadius = 10;

  // Normalize data for scaling
  const maxDataValue = Math.max(...data.map(point => point.value), 1); // Avoid division by zero
  const scaleX = (width - 2 * margin) / (data.length - 1);
  const scaleY = (height - 2 * margin) / maxDataValue;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Sensor Data</Text>
      <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        {data.map((point, index) => (
          <Circle
            key={index}
            cx={margin + index * scaleX}
            cy={height - margin - point.value * scaleY}
            r={indicatorRadius}
            fill="blue"
            stroke="black"
            strokeWidth="1"
          />
        ))}
        {data.map((point, index) => (
          index < data.length - 1 && (
            <Rect
              key={`bar-${index}`}
              x={margin + index * scaleX - indicatorRadius / 2}
              y={height - margin - point.value * scaleY}
              width={indicatorRadius}
              height={height - margin - point.value * scaleY}
              fill="rgba(0, 0, 255, 0.3)"
            />
          )
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default VirtualIndicators;
