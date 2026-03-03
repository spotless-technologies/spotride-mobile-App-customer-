import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const ChooseMode = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const handleSelectMode = (mode: 'passenger' | 'driver') => {
        router.push({
            pathname: '/(auth)/signup',
            params: { mode }
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <View style={styles.headerImagePlaceholder}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1000&auto=format&fit=crop' }}
                        style={styles.headerImage}
                    />
                    <View style={styles.overlay} />
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>spot<Text style={{ color: themeColors.primary }}>ride</Text></Text>
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Choose Your Mode</Text>
                        <Text style={styles.subtitle}>Select how you want to use SpotRide</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.primary }]}
                    onPress={() => handleSelectMode('passenger')}
                >
                    <View style={styles.cardIconContainer}>
                        <Ionicons name="person" size={40} color={themeColors.primary} />
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={[styles.cardTitle, { color: themeColors.text }]}>I'm a Passenger</Text>
                        <Text style={[styles.cardSubtitle, { color: themeColors.icon }]}>Book rides and get to your destination safely</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
                    onPress={() => handleSelectMode('driver')}
                >
                    <View style={styles.cardIconContainer}>
                        <Ionicons name="car" size={40} color={themeColors.primary} />
                    </View>
                    <View style={styles.cardTextContainer}>
                        <Text style={[styles.cardTitle, { color: themeColors.text }]}>I'm a Driver</Text>
                        <Text style={[styles.cardSubtitle, { color: themeColors.icon }]}>Earn money by giving rides to passengers</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: themeColors.text }]}>
                    Already have an account?{' '}
                    <Text
                        style={[styles.link, { color: themeColors.primary }]}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        Sign In
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: '45%',
        width: '100%',
    },
    headerImagePlaceholder: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    logoContainer: {
        position: 'absolute',
        top: 60,
        width: '100%',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: -1,
    },
    headerContent: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#EEE',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardIconContainer: {
        marginRight: 20,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        paddingBottom: 40,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
    },
    link: {
        fontWeight: 'bold',
    },
});

export default ChooseMode;
