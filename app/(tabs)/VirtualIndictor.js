import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

const VirtualIndicators = ({ data }) => {
  const width = 300;
  const height = 200;
  const margin = 20;
  const indicatorRadius = 10;

  if (data.length === 0) {
    return <Text>No data available</Text>;
  }

  // Normalize data for scaling
  const maxDataValue = Math.max(...data.map(point => point.value), 1); // Avoid division by zero
  const scaleX = (width - 2 * margin) / (data.length - 1);
  const scaleY = (height - 2 * margin) / maxDataValue;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Real-Time Sensor Data</Text>
      <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
        {data.map((point, index) => {
          const cx = margin + index * scaleX;
          const cy = height - margin - (point.value || 0) * scaleY;

          return (
            <Circle
              key={index}
              cx={isNaN(cx) ? 0 : cx} // Fallback to 0 if NaN
              cy={isNaN(cy) ? 0 : cy} // Fallback to 0 if NaN
              r={indicatorRadius}
              fill="blue"
              stroke="black"
              strokeWidth="1"
            />
          );
        })}
        {data.map((point, index) => {
          if (index >= data.length - 1) return null;

          const x = margin + index * scaleX - indicatorRadius / 2;
          const y = height - margin - (point.value || 0) * scaleY;
          const heightValue = height - margin - y;

          return (
            <Rect
              key={`bar-${index}`}
              x={isNaN(x) ? 0 : x} // Fallback to 0 if NaN
              y={isNaN(y) ? 0 : y} // Fallback to 0 if NaN
              width={indicatorRadius}
              height={isNaN(heightValue) ? 0 : heightValue} // Fallback to 0 if NaN
              fill="rgba(0, 0, 255, 0.3)"
            />
          );
        })}
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
