import { useToast } from '@/components/common/ToastContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const Verify = () => {
    const { identifier } = useLocalSearchParams<{ identifier: string }>();
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
            const response = await authService.verifyToken(code);
            if (response.success) {
                showToast(response.message, 'success');
                setTimeout(() => {
                    router.replace('/(tabs)');
                }, 1500);
            } else {
                showToast(response.message, 'error');
            }
        } catch (error) {
            showToast('An unexpected error occurred.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const response = await authService.resendCode(identifier || '');
            showToast(response.message, response.success ? 'success' : 'error');
            if (response.success) setTimer(300);
        } catch (error) {
            showToast('Could not resend code.', 'error');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: themeColors.background }]}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop' }}
                        style={styles.headerImage}
                    />
                    <View style={styles.overlay} />
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>spot<Text style={{ color: themeColors.primary }}>ride</Text></Text>
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Verify Your Account</Text>
                        <Text style={styles.subtitle}>Enter the verification code we sent you</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.iconWrapper}>
                        <View style={[styles.mainIconContainer, { backgroundColor: '#FFD7C2' }]}>
                            <Ionicons name="call" size={32} color={themeColors.primary} />
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={[styles.infoText, { color: themeColors.text }]}>
                            We've sent a 6-digit verification code to
                        </Text>
                        <Text style={[styles.identifierText, { color: themeColors.text }]}>
                            {identifier || '08012345678'}
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.text }]}>Verification Code <Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={[styles.inputWrapper, errors.code ? { borderColor: 'red' } : { borderColor: '#E0E0E0' }]}>
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor="#999"
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
                    >
                        <Text style={styles.verifyButtonText}>{isLoading ? 'Verifying...' : 'Verify Code'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.changeButton}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.changeButtonText, { color: themeColors.text }]}>Change phone number</Text>
                    </TouchableOpacity>

                    <View style={styles.resendContainer}>
                        <Text style={[styles.resendText, { color: themeColors.text }]}>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 250,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 150,
        transform: [{ scaleX: 1.5 }],
    },
    logoContainer: {
        position: 'absolute',
        top: 50,
        width: '100%',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerContent: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#EEE',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 25,
        paddingTop: 20,
    },
    iconWrapper: {
        alignItems: 'center',
        marginTop: -40,
        zIndex: 10,
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
        marginTop: 30,
        marginBottom: 40,
    },
    infoText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5,
    },
    identifierText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputGroup: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        height: 56,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 15,
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    input: {
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 4,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    timerText: {
        textAlign: 'center',
        marginTop: 15,
        color: '#666',
        fontSize: 14,
    },
    verifyButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    verifyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    changeButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 30,
    },
    changeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    resendText: {
        fontSize: 16,
    },
    link: {
        fontWeight: 'bold',
    },
});

export default Verify;
