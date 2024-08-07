import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const GEO_FENCES = [
  { id: 'home', latitude: -1.8938726673711472, longitude: 30.056510471725183, radius: 100 },
  { id: 'work', latitude: -1.9552169563201052, longitude: 30.103698605723125, radius: 100 },
];


const LocationTracking = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [enteredGeofences, setEnteredGeofences] = useState(new Set());
  const watchRef = useRef(null);

  useEffect(() => {
    const getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          GEO_FENCES.forEach((fence) => {
            const distance = getDistanceFromLatLonInKm(latitude, longitude, fence.latitude, fence.longitude);
            const isInside = distance < fence.radius / 1000;

            if (isInside && !enteredGeofences.has(fence.id)) {
              Alert.alert(`Entered ${fence.id}`);
              setEnteredGeofences((prev) => new Set(prev).add(fence.id));
            } else if (!isInside && enteredGeofences.has(fence.id)) {
              Alert.alert(`Exited ${fence.id}`);
              setEnteredGeofences((prev) => {
                const newSet = new Set(prev);
                newSet.delete(fence.id);
                return newSet;
              });
            }
          });
        }
      );
    };

    getLocationPermission();

    return () => {
      if (watchRef.current) {
        watchRef.current.remove();
      }
    };
  }, [enteredGeofences]);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <MapView
  style={styles.map}
  region={{
    latitude: location ? location.latitude : -1.9706,
    longitude: location ? location.longitude : 30.1044,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  {GEO_FENCES.map((fence) => (
    <Circle
      key={fence.id}
      center={{ latitude: fence.latitude, longitude: fence.longitude }}
      radius={fence.radius}
      strokeColor="rgba(158, 158, 255, 0.3)"
      fillColor="rgba(158, 158, 255, 0.1)"
    />
  ))}
  {location && (
    <Marker coordinate={location} title="Your Location" />
  )}
</MapView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LocationTracking;
