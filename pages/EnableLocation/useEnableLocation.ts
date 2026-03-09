import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';

export const useEnableLocation = (mode: 'passenger' | 'driver') => {
    const [isRequesting, setIsRequesting] = useState(false);

    /**
     * Ask the OS for foreground location permission.
     * On success (or if already granted) navigate to the correct tab dashboard.
     */
    const handleGrantPermission = async () => {
        setIsRequesting(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status === 'granted') {
                navigateToDashboard();
            } else {
                // Permission denied – still let the user proceed but without location
                navigateToDashboard();
            }
        } catch (error) {
            console.error('[EnableLocation] Permission error:', error);
            navigateToDashboard();
        } finally {
            setIsRequesting(false);
        }
    };

    /**
     * Skip location permission – navigate directly to the dashboard.
     */
    const handleMaybeLater = () => {
        navigateToDashboard();
    };

    /**
     * Route the user to the appropriate home based on their chosen mode.
     * Adjust these routes once the passenger / driver tab screens exist.
     */
    const navigateToDashboard = () => {
        if (mode === 'driver') {
            router.replace('/(tabs)');
        } else {
            router.replace('/(tabs)');
        }
    };

    return { isRequesting, handleGrantPermission, handleMaybeLater };
};
