import { useToast } from '@/components/common/ToastContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

const ResetPassword = () => {
    const { identifier } = useLocalSearchParams<{ identifier: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { showToast } = useToast();

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!code || code.length < 6) newErrors.code = 'Please enter the 6-digit reset code';
        if (!password) newErrors.password = 'New password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleResetPassword = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            const response = await authService.resetPassword(code, password);
            if (response.success) {
                showToast(response.message, 'success');
                setTimeout(() => {
                    router.replace('/login');
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
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Create a new secure password for your account.</Text>
                    </View>
                    <View style={styles.archOrange} />
                    <View style={styles.archWhite} />
                </View>

                {/* ── FORM ── */}
                <View style={styles.formContainer}>
                    <View style={styles.iconWrapper}>
                        <View style={[styles.mainIconContainer, { backgroundColor: '#FFD7C2' }]}>
                            <Ionicons name="lock-open-outline" size={32} color={themeColors.primary} />
                        </View>
                    </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>
                            Resetting password for
                        </Text>
                        <Text style={styles.identifierText}>
                            {identifier || 'your account'}
                        </Text>
                    </View>

                    {/* Reset Code */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Reset Code <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.code ? styles.inputError : null]}>
                            <TextInput
                                style={[styles.input, { textAlign: 'center', letterSpacing: 4 }]}
                                placeholder="123456"
                                placeholderTextColor="#BBB"
                                keyboardType="number-pad"
                                maxLength={6}
                                value={code}
                                onChangeText={(val) => {
                                    setCode(val);
                                    if (errors.code) setErrors((prev) => ({ ...prev, code: '' }));
                                }}
                            />
                        </View>
                        {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
                    </View>

                    {/* New Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            New Password <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter new password"
                                placeholderTextColor="#BBB"
                                secureTextEntry
                                value={password}
                                onChangeText={(val) => {
                                    setPassword(val);
                                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                                }}
                            />
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Confirm Password <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm new password"
                                placeholderTextColor="#BBB"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={(val) => {
                                    setConfirmPassword(val);
                                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                                }}
                            />
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    <TouchableOpacity
                        style={[styles.resetButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleResetPassword}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.resetButtonText}>
                            {isLoading ? 'Resetting...' : 'Update Password'}
                        </Text>
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
    infoContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 14,
        color: '#777',
    },
    identifierText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    inputGroup: {
        marginBottom: 18,
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
        height: 54,
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
        fontSize: 15,
        color: '#111218',
    },
    errorText: {
        color: '#E8440A',
        fontSize: 12,
        marginTop: 4,
    },
    resetButton: {
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 40,
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
});

export default ResetPassword;
