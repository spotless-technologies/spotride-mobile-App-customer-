import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const ChooseMode = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const handleSelectMode = (mode: 'passenger' | 'driver') => {
        // router.push({
        //     pathname: '/(auth)/signup',
        //     params: { mode }
        // });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#FDF5ED' }]}>
            <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
                {/* ── HEADER ── */}
                <View style={styles.header}>
                    <Image
                        source={require('@/assets/images/onboarding/verify.png')}
                        style={styles.headerImage}
                    />
                    <View style={styles.overlay} />

                    <View style={styles.headerContent}>
                        <Image
                            source={require('@/assets/images/onboarding/Untitled-1 2.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Choose Your Mode</Text>
                        <Text style={styles.subtitle}>Select how you want to use SpotRide</Text>
                    </View>
                </View>

                {/* ── CONTENT ── */}
                <View style={styles.content}>
                    {/* Passenger Card */}
                    <View style={styles.cardWrapper}>
                        <Image
                            source={require('@/assets/images/onboarding/passenger.png')}
                            style={styles.passengerImage}
                            resizeMode="contain"
                        />
                        <TouchableOpacity
                            style={[styles.card, { borderColor: '#E8440A' }]}
                            onPress={() => handleSelectMode('passenger')}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>I'm a Passenger</Text>
                                <Text style={styles.cardSubtitle}>Book rides and get to your destination safely</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Driver Card */}
                    <View style={styles.cardWrapper}>
                        <View style={styles.driverImagePlaceholder}>
                            <Ionicons name="car-sport" size={60} color="#666" />
                        </View>
                        <TouchableOpacity
                            style={[styles.card, { borderColor: '#DDD' }]}
                            onPress={() => handleSelectMode('driver')}
                            activeOpacity={0.9}
                        >
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>I'm a Driver</Text>
                                <Text style={styles.cardSubtitle}>Earn money by giving rides to passengers</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── FOOTER ── */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Already have an account?{' '}
                        <Text
                            style={styles.link}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            Sign In
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: height * 0.42,
        width: '100%',
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    headerContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 160,
        height: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFF',
        opacity: 0.9,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
    },
    cardWrapper: {
        marginBottom: 40,
        position: 'relative',
        height: 100,
        justifyContent: 'center',
    },
    passengerImage: {
        position: 'absolute',
        left: -10,
        top: -30,
        width: 100,
        height: 130,
        zIndex: 10,
    },
    driverImagePlaceholder: {
        position: 'absolute',
        left: 10,
        top: -10,
        width: 80,
        height: 100,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1.5,
        height: 85,
        paddingLeft: 100,
        paddingRight: 20,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    cardTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 19,
        fontWeight: '800',
        color: '#111218',
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#666',
        lineHeight: 16,
    },
    footer: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#555',
    },
    link: {
        fontWeight: '900',
        color: '#E8440A',
    },
});

export default ChooseMode;
