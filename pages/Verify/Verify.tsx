import { useToast } from '@/components/common/ToastContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PUBLIC_API_BASE_URL } from '@/utils/Api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const Verify = () => {
    const { identifier } = useLocalSearchParams<{ identifier: string }>();
    // console.log('[Verify] Identifier:', identifier);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { showToast } = useToast();

    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(300);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleVerify = async () => {
        if (!code || code.length < 6) {
            setErrors({ code: 'Please enter a valid 6-digit code' });
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                email: identifier || '',
                otp: code
            };

            console.log('[Verify] Sending payload:', payload);
            const response = await axios.post(`${PUBLIC_API_BASE_URL}/auth/verify-login`, payload);

            if (response.status === 200 || response.status === 201) {
                const { access_token, refresh_token, user } = response.data.data;

                // Save credentials
                await Promise.all([
                    AsyncStorage.setItem('access_token', access_token),
                    AsyncStorage.setItem('refresh_token', refresh_token),
                    AsyncStorage.setItem('user', JSON.stringify(user)),
                    AsyncStorage.setItem('userId', user.id)
                ]);

                showToast('Login verified successfully!', 'success');
                setTimeout(() => {
                    router.replace('/choose-mode');
                }, 1500);
            } else {
                showToast(response.data?.message || 'Verification failed', 'error');
            }
        } catch (error: any) {
            console.error('[Verify] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const payload = {
                email: identifier || '',
                method: 'both' // Assuming this is needed for resend too
            };
            console.log('[Verify] Resending OTP for:', identifier);
            // We use the login/password endpoint which triggers the OTP resend logic in the backend
            const response = await axios.post(`${PUBLIC_API_BASE_URL}/auth/login/password`, {
                email: identifier,
                password: '', // Password might not be needed if just resending, or there might be a separate endpoint
                method: 'both'
            });

            if (response.status === 200 || response.status === 201) {
                showToast('Verification code resent!', 'success');
                setTimer(300);
            } else {
                showToast(response.data?.message || 'Failed to resend code', 'error');
            }
        } catch (error: any) {
            console.error('[Verify] Resend Error:', error);
            const errorMessage = error.response?.data?.message || 'Could not resend code.';
            showToast(errorMessage, 'error');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
            >
                {/* ── HEADER ── */}
                <View style={styles.header}>
                    <View style={styles.bgImage}>
                        <Image
                            source={require('@/assets/images/onboarding/splash.png')}
                            style={styles.headerImage}
                        />
                    </View>

                    {/* Dark tint over photo */}
                    <View style={styles.darkOverlay} />

                    {/* SpotRide logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/onboarding/Untitled-1 2.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Title block */}
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Verify Account</Text>
                        <Text style={styles.subtitle}>Secure your account with the code sent to you.</Text>
                    </View>

                    {/* Orange arch ring */}
                    <View style={styles.archOrange} />
                    {/* White arch fill */}
                    <View style={styles.archWhite} />
                </View>

                {/* ── FORM ── */}
                <View style={styles.formContainer}>
                    <View style={styles.iconWrapper}>
                        <View style={[styles.mainIconContainer, { backgroundColor: '#FFD7C2' }]}>
                            <Ionicons name="shield-checkmark" size={32} color={themeColors.primary} />
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            We've sent a 6-digit verification code to
                        </Text>
                        <Text style={styles.identifierText}>
                            {identifier || '08012345678'}
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Verification Code <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.code ? styles.inputError : null]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor="#BBB"
                                keyboardType="number-pad"
                                maxLength={6}
                                value={code}
                                onChangeText={(val) => {
                                    setCode(val);
                                    if (errors.code) setErrors({});
                                }}
                            />
                        </View>
                        {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
                        <Text style={styles.timerText}>
                            Code expires in <Text style={{ color: themeColors.primary, fontWeight: 'bold' }}>{formatTime(timer)}</Text>
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.verifyButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleVerify}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.verifyButtonText}>
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.changeButtonText}>Change Details</Text>
                    </TouchableOpacity>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>
                            Didn't receive the code?{' '}
                            <Text
                                style={[styles.link, { color: timer === 0 ? themeColors.primary : '#AAA' }]}
                                onPress={timer === 0 ? handleResend : undefined}
                            >
                                Resend Code
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const ARCH_WIDTH = width * 1.0;
const ARCH_RADIUS = ARCH_WIDTH / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: 560,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#111218',
    },
    bgImage: {
        height: 760,
    },
    headerImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.42)',
    },
    logoContainer: {
        position: 'absolute',
        top: 150,
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
    },
    logoImage: {
        width: 150,
        height: 44,
    },
    headerContent: {
        position: 'absolute',
        top: 228,
        width: '100%',
        alignItems: 'center',
        zIndex: 10,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.88)',
        textAlign: 'center',
    },
    archOrange: {
        position: 'absolute',
        bottom: -14,
        alignSelf: 'center',
        width: ARCH_WIDTH + 18,
        height: 176,
        borderTopLeftRadius: ARCH_RADIUS + 4,
        borderTopRightRadius: ARCH_RADIUS + 4,
        backgroundColor: '#E07520',
    },
    archWhite: {
        position: 'absolute',
        bottom: -10,
        alignSelf: 'center',
        width: ARCH_WIDTH,
        height: 176,
        borderTopLeftRadius: ARCH_RADIUS,
        borderTopRightRadius: ARCH_RADIUS,
        backgroundColor: '#FFFFFF',
    },
    formContainer: {
        paddingHorizontal: 24,
        paddingTop: 0,
        backgroundColor: '#FFFFFF',
    },
    iconWrapper: {
        alignItems: 'center',
        marginTop: -60,
        zIndex: 20,
    },
    mainIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 5,
    },
    identifierText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111218',
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    required: {
        color: '#E8440A',
    },
    inputWrapper: {
        height: 56,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        paddingHorizontal: 14,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
    },
    inputError: {
        borderColor: '#E8440A',
    },
    input: {
        fontSize: 24,
        color: '#111218',
        textAlign: 'center',
        letterSpacing: 8,
        fontWeight: '800',
    },
    errorText: {
        color: '#E8440A',
        fontSize: 12,
        marginTop: 4,
    },
    timerText: {
        textAlign: 'center',
        marginTop: 15,
        color: '#777',
        fontSize: 14,
    },
    verifyButton: {
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
    verifyButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    changeButton: {
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 24,
    },
    changeButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#444',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    resendText: {
        fontSize: 14,
        color: '#555',
    },
    link: {
        fontWeight: '700',
    },
});

export default Verify;
