import { useToast } from '@/components/common/ToastContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

const ForgotPassword = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { showToast } = useToast();

    const [identifier, setIdentifier] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        if (!identifier) {
            setErrors({ identifier: 'Email Address or Phone Number is required' });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleRequestReset = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            const response = await authService.forgotPassword(identifier);
            if (response.success) {
                showToast(response.message, 'success');
                setTimeout(() => {
                    router.push({
                        pathname: '/reset-password',
                        params: { identifier }
                    });
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
                    <View style={styles.darkOverlay} />
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('@/assets/images/onboarding/Untitled-1 2.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.title}>Forgot Password</Text>
                        <Text style={styles.subtitle}>Enter your details to receive a reset code.</Text>
                    </View>
                    <View style={styles.archOrange} />
                    <View style={styles.archWhite} />
                </View>

                {/* ── FORM ── */}
                <View style={styles.formContainer}>
                    <View style={styles.iconWrapper}>
                        <View style={[styles.mainIconContainer, { backgroundColor: '#FFD7C2' }]}>
                            <Ionicons name="key-outline" size={32} color={themeColors.primary} />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Email or Phone <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.identifier ? styles.inputError : null]}>
                            <TextInput
                                style={styles.input}
                                placeholder="merchant@example.com / 080..."
                                placeholderTextColor="#BBB"
                                value={identifier}
                                onChangeText={(val) => {
                                    setIdentifier(val);
                                    if (errors.identifier) setErrors({});
                                }}
                                autoCapitalize="none"
                            />
                        </View>
                        {errors.identifier && <Text style={styles.errorText}>{errors.identifier}</Text>}
                        <Text style={styles.hintText}>
                            We'll send a 6-digit code to this identifier to verify your ownership.
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.resetButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleRequestReset}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.resetButtonText}>
                            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Back to Login</Text>
                    </TouchableOpacity>
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
    inputGroup: {
        marginTop: 30,
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
        fontSize: 16,
        color: '#111218',
    },
    errorText: {
        color: '#E8440A',
        fontSize: 12,
        marginTop: 4,
    },
    hintText: {
        color: '#777',
        fontSize: 13,
        marginTop: 12,
        lineHeight: 18,
    },
    resetButton: {
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
    resetButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    backButton: {
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 40,
    },
    backButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#444',
    },
});

export default ForgotPassword;
