import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const RealtimeMap = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get initial location
            let initialLocation = await Location.getCurrentPositionAsync({});
            setLocation(initialLocation);

            // Watch for location changes
            const subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 5000,
                    distanceInterval: 10,
                },
                (newLocation) => {
                    setLocation(newLocation);
                    // Optionally animate map to new location
                    /*
                    mapRef.current?.animateToRegion({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }, 1000);
                    */
                }
            );

            return () => subscription.remove();
        })();
    }, []);

    const initialRegion = {
        latitude: location?.coords.latitude || 6.5244, // Default to Lagos, Nigeria
        longitude: location?.coords.longitude || 3.3792,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={false}
                // Custom map style can be added here
            >
                {/* Nearby Cars (Simulated for Now) */}
                <Marker
                    coordinate={{ latitude: 6.5250, longitude: 3.3800 }}
                    title="Driver 1"
                    image={require('@/assets/images/onboarding/car.png')}
                    style={{ width: 40, height: 40 }}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default RealtimeMap;
