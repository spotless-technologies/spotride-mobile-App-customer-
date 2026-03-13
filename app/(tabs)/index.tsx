import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import HomeLayout from '@/components/common/HomeLayout';
import RealtimeMap from '@/components/map/RealtimeMap';
import DestinationSearch from '@/components/home/DestinationSearch';

export default function HomeScreen() {
    const handleFindVehicles = () => {
        console.log('Finding vehicles...');
        // Navigation to vehicle selection screen would go here
    };

    return (
        <HomeLayout>
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                
                {/* Real-time Map Background */}
                <RealtimeMap />

                {/* Search Bottom Sheet */}
                <View style={styles.bottomSheetContainer}>
                    <DestinationSearch onFindVehicles={handleFindVehicles} />
                </View>
            </View>
        </HomeLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheetContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});

