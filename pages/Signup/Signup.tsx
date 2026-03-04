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

const Signup = () => {
    const { mode } = useLocalSearchParams<{ mode: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { showToast } = useToast();

    const [signupType, setSignupType] = useState<'email' | 'phone'>('email');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (signupType === 'email') {
            if (!email) newErrors.email = 'Email Address is required';
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email Address is invalid';
        } else {
            if (!phone) newErrors.phone = 'Phone Number is required';
        }
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        if (!validate()) return;
        setIsLoading(true);
        try {
            const data = {
                fullName,
                identifier: signupType === 'email' ? email : phone,
                password,
                mode: mode || 'passenger',
            };
            const response = await authService.signUp(data);
            if (response.success) {
                showToast(response.message, 'success');
                setTimeout(() => {
                    router.push({
                        pathname: '/verify',
                        params: { identifier: data.identifier },
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
                        <Text style={styles.title}>Welcome to SpotRide</Text>
                        <Text style={styles.subtitle}>Get there faster, safer, and smarter.</Text>
                    </View>

                    {/* Orange arch ring (slightly larger, sits behind white arch) */}
                    <View style={styles.archOrange} />
                    {/* White arch fills the screen below */}
                    <View style={styles.archWhite} />
                </View>

                {/* ── FORM ── */}
                <View style={styles.formContainer}>

                    {/* Email / Phone tab */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, signupType === 'email' && styles.activeTab]}
                            onPress={() => setSignupType('email')}
                        >
                            <Ionicons
                                name="mail-outline"
                                size={18}
                                color={signupType === 'email' ? '#111218' : '#999'}
                            />
                            <Text style={[styles.tabText, signupType === 'email' && styles.activeTabText]}>
                                Email
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, signupType === 'phone' && styles.activeTab]}
                            onPress={() => setSignupType('phone')}
                        >
                            <Ionicons
                                name="call-outline"
                                size={18}
                                color={signupType === 'phone' ? '#111218' : '#999'}
                            />
                            <Text style={[styles.tabText, signupType === 'phone' && styles.activeTabText]}>
                                Phone
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Full Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Full Name <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.fullName && styles.inputError]}>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor="#BBB"
                                value={fullName}
                                onChangeText={setFullName}
                                autoCapitalize="words"
                            />
                        </View>
                        {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
                    </View>

                    {/* Email or Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {signupType === 'email' ? 'Email Address' : 'Phone Number'}{' '}
                            <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, (errors.email || errors.phone) && styles.inputError]}>
                            <TextInput
                                style={styles.input}
                                placeholder={signupType === 'email' ? 'business@example.com' : '08012345678'}
                                placeholderTextColor="#BBB"
                                value={signupType === 'email' ? email : phone}
                                onChangeText={signupType === 'email' ? setEmail : setPhone}
                                keyboardType={signupType === 'email' ? 'email-address' : 'phone-pad'}
                                autoCapitalize="none"
                            />
                        </View>
                        {(errors.email || errors.phone) ? (
                            <Text style={styles.errorText}>{errors.email || errors.phone}</Text>
                        ) : null}
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Password <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Create a strong password"
                                placeholderTextColor="#BBB"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        {errors.password ? (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ) : (
                            <Text style={styles.hintText}>
                                Must contain at least 8 characters, one number, and one special character
                            </Text>
                        )}
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Confirm Password <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#BBB"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        {errors.confirmPassword ? (
                            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                        ) : null}
                    </View>

                    {/* Remember me + Forgot Password */}
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View style={[styles.checkbox, rememberMe && { borderColor: themeColors.primary }]}>
                                {rememberMe && (
                                    <Ionicons name="checkmark" size={14} color={themeColors.primary} />
                                )}
                            </View>
                            <Text style={styles.checkboxLabel}>Remember me</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => showToast('Forgot password coming soon', 'info')}>
                            <Text style={[styles.forgotPassword, { color: themeColors.primary }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity> */}
                    </View>

                    {/* Sign Up button */}
                    <TouchableOpacity
                        style={[styles.signupButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleSignup}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.signupButtonText}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <Text style={styles.dividerText}>Or continue with</Text>
                    </View>

                    {/* Social buttons */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={22} color="#DB4437" />
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account?{' '}
                            <Text
                                style={[styles.footerLink, { color: themeColors.primary }]}
                                onPress={() => router.push('/login')}
                            >
                                Login
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

    /* ── Header / hero ── */
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

    /* ── Two-layer arch ── */
    archOrange: {
        position: 'absolute',
        bottom: -14,               // peeks slightly below the white arch
        alignSelf: 'center',
        width: ARCH_WIDTH + 18,    // slightly wider than the white arch
        height: 176,
        borderTopLeftRadius: ARCH_RADIUS + 4,
        borderTopRightRadius: ARCH_RADIUS + 4,
        backgroundColor: '#E07520', // orange ring colour
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

    /* ── Form ── */
    formContainer: {
        paddingHorizontal: 24,
        // paddingTop: 0,
        backgroundColor: '#FFFFFF',
    },

    /* Tabs */
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 11,
        borderRadius: 8,
        gap: 6,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    activeTabText: {
        color: '#111218',
    },

    /* Inputs */
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
    hintText: {
        color: '#888',
        fontSize: 11,
        marginTop: 4,
        lineHeight: 16,
    },

    /* Remember me row */
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1.5,
        borderColor: '#BDBDBD',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    forgotPassword: {
        fontSize: 14,
        fontWeight: '700',
    },

    /* Sign Up button */
    signupButton: {
        height: 52,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },

    /* Divider */
    dividerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerText: {
        color: '#888',
        fontSize: 13,
    },

    /* Social */
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 32,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: '#F6F6F6',
    },
    socialText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#222',
    },

    /* Footer */
    footer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    footerText: {
        fontSize: 14,
        color: '#555',
    },
    footerLink: {
        fontWeight: '700',
    },
});

export default Signup;
