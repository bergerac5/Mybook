import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const homeLocation = {
  latitude: -1.8941140,
  longitude: 30.0564240,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const geofenceRadius = 10; // 10 meters radius

const LocationTracking = () => {
  const [location, setLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [insideGeofence, setInsideGeofence] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed to use this feature.');
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
          checkGeofence(newLocation.coords);
        }
      );
    })();
  }, []);

  const checkGeofence = (coords) => {
    const distance = getDistance(coords, homeLocation);
    const isInside = distance < geofenceRadius;

    if (isInside && !insideGeofence) {
      // Entered the geofence
      setInsideGeofence(true);
      Alert.alert('Geofence Alert', 'You have entered the home area.');
    } else if (!isInside && insideGeofence) {
      // Exited the geofence
      setInsideGeofence(false);
      Alert.alert('Geofence Alert', 'You have exited the home area.');
    }
  };

  const getDistance = (coords1, coords2) => {
    const { latitude: lat1, longitude: lon1 } = coords1;
    const { latitude: lat2, longitude: lon2 } = coords2;
    // Calculate distance between two coordinates using Haversine formula
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  if (!hasLocationPermission) {
    return <Text>No access to location services.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          ...homeLocation,
          latitudeDelta: homeLocation.latitudeDelta,
          longitudeDelta: homeLocation.longitudeDelta,
        }}
      >
        <Marker coordinate={homeLocation} title="Home" />
        {location && (
          <>
            <Marker coordinate={location} pinColor="blue" title="Your Location" />
            <Circle
              center={homeLocation}
              radius={geofenceRadius}
              strokeColor="rgba(0, 255, 0, 0.5)"
              fillColor="rgba(0, 255, 0, 0.2)"
            />
          </>
        )}
      </MapView>
    </View>
  );
};

export default LocationTracking;
