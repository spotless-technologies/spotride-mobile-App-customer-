import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface SidebarProps {
    onClose: () => void;
    currentMode: 'passenger' | 'driver';
    onSwitchMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, currentMode, onSwitchMode }) => {
    const menuItems = [
        { icon: 'home-outline', label: 'Home', route: '/(tabs)' },
        { icon: 'time-outline', label: 'Trips', route: '/trips' },
        { icon: 'car-outline', label: 'Rent a Car', route: '/rent-car' },
        { icon: 'wallet-outline', label: 'Wallet', route: '/wallet' },
        { icon: 'notifications-outline', label: 'Notifications', route: '/notifications' },
        { icon: 'settings-outline', label: 'Settings', route: '/settings' },
        { icon: 'person-outline', label: 'Profile', route: '/profile' },
    ];

    const handleNavigation = (route: string) => {
        onClose();
        setTimeout(() => {
            router.push(route as any);
        }, 300);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.profileContainer}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=morgan' }}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Morgan Avery</Text>
                        <View style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons key={star} name="star" size={16} color="#FFF" />
                            ))}
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.menuItem}
                        onPress={() => handleNavigation(item.route)}
                    >
                        <Ionicons name={item.icon as any} size={24} color="#333" style={styles.menuIcon} />
                        <Text style={styles.menuLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.switchButton} onPress={onSwitchMode}>
                    <Text style={styles.switchButtonText}>
                        Switch to {currentMode === 'passenger' ? 'Driver' : 'Passenger'} mode
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        backgroundColor: '#E08E55',
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomRightRadius: 30,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    profileInfo: {
        marginLeft: 15,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    ratingText: {
        color: '#FFF',
        marginLeft: 5,
        fontSize: 14,
    },
    menuContainer: {
        flex: 1,
        marginTop: 20,
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    menuIcon: {
        marginRight: 15,
    },
    menuLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    footer: {
        padding: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#EEE',
    },
    switchButton: {
        backgroundColor: '#F97316',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    switchButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Sidebar;
