import { useToast } from '@/components/common/ToastContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PUBLIC_API_BASE_URL } from '@/utils/Api';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const Login = () => {
    const { identifier } = useLocalSearchParams<{ identifier: string }>();
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { showToast } = useToast();

    const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (identifier) {
            console.log('[Login] Received identifier:', identifier);
            // Check if identifier looks like an email or phone
            if (identifier.includes('@')) {
                setLoginType('email');
                setEmail(identifier);
            } else {
                setLoginType('phone');
                setPhone(identifier);
            }
        }
    }, [identifier]);

    // useEffect(() => {
    //     const checkAuthStatus = async () => {
    //         try {
    //             const token = await AsyncStorage.getItem('login_token');
    //             const userId = await AsyncStorage.getItem('userId');

    //             if (!token && !userId) {
    //                 // No auth data found, redirect to signup
    //                 router.replace('/signup');
    //             } else {
    //                 setIsCheckingAuth(false);
    //             }
    //         } catch (error) {
    //             console.error('Error checking auth status:', error);
    //             setIsCheckingAuth(false);
    //         }
    //     };

    //     checkAuthStatus();
    // }, []);

    // if (isCheckingAuth) {
    //     return <View style={[styles.container, { backgroundColor: themeColors.background }]} />;
    // }

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (loginType === 'email') {
            if (!email) newErrors.email = 'Email is required';
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        } else {
            if (!phone) newErrors.phone = 'Phone number is required';
        }
        if (!password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleLogin = () => {
        router.replace('/(auth)/choose-mode');
    };
    const handleLogins = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const identifierValue = loginType === 'email' ? email : phone;
            const payload = {
                email: identifierValue.trim(),
                password,
                method: 'both',
            };

            console.log('[Login] Sending payload:', payload);
            const response = await axios.post(`${PUBLIC_API_BASE_URL}/auth/login/password`, payload);
            console.log("response_data", response.data)
            if (response.status === 200 || response.status === 201) {
                showToast('Login successful!', 'success');
                setTimeout(() => {
                    router.replace('/(auth)/verify');
                }, 1500);
            } else {
                showToast(response.data?.message || 'Login failed', 'error');
            }
        } catch (error: any) {
            console.error('[Login] Error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
            showToast(errorMessage, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: '#FFFFFF' }]}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
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
                        <Text style={styles.title}>Welcome to SpotRide</Text>
                        <Text style={styles.subtitle}>Get there faster, safer, and smarter.</Text>
                    </View>
                    {/* Orange arch ring */}
                    <View style={styles.archOrange} />
                    {/* White arch fill */}
                    <View style={styles.archWhite} />
                </View>

                {/* ── FORM ── */}
                <View style={styles.formContainer}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, loginType === 'email' && styles.activeTab]}
                            onPress={() => setLoginType('email')}
                        >
                            <Ionicons name="mail-outline" size={18} color={loginType === 'email' ? '#111218' : '#999'} />
                            <Text style={[styles.tabText, loginType === 'email' && styles.activeTabText]}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, loginType === 'phone' && styles.activeTab]}
                            onPress={() => setLoginType('phone')}
                        >
                            <Ionicons name="call-outline" size={18} color={loginType === 'phone' ? '#111218' : '#999'} />
                            <Text style={[styles.tabText, loginType === 'phone' && styles.activeTabText]}>Phone</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            {loginType === 'email' ? 'Email Address' : 'Phone Number'} <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.email || errors.phone ? styles.inputError : null]}>
                            <TextInput
                                style={styles.input}
                                placeholder={loginType === 'email' ? 'merchant@example.com' : '08012345678'}
                                placeholderTextColor="#BBB"
                                value={loginType === 'email' ? email : phone}
                                onChangeText={loginType === 'email' ? setEmail : setPhone}
                                keyboardType={loginType === 'email' ? 'email-address' : 'phone-pad'}
                                autoCapitalize="none"
                            />
                        </View>
                        {(errors.email || errors.phone) && <Text style={styles.errorText}>{errors.email || errors.phone}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputWrapper, styles.passwordWrapper, errors.password ? styles.inputError : null]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#BBB"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={22}
                                    color="#999"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

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
                        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
                            <Text style={[styles.forgotPassword, { color: themeColors.primary }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.loginButtonText}>{isLoading ? 'Logging In...' : 'Login'}</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <Text style={styles.dividerText}>Or continue with</Text>
                    </View>

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

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Don't have an account?{' '}
                            <Text
                                style={[styles.link, { color: themeColors.primary }]}
                                onPress={() => router.push('/(auth)/signup')}
                            >
                                Sign Up
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
        paddingTop: 16,
        backgroundColor: '#FFFFFF',
    },
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
        flex: 1,
        fontSize: 15,
        color: '#111218',
    },
    errorText: {
        color: '#E8440A',
        fontSize: 12,
        marginTop: 4,
    },
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
    loginButton: {
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
    loginButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    dividerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerText: {
        color: '#888',
        fontSize: 13,
    },
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
    footer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    footerText: {
        fontSize: 14,
        color: '#555',
    },
    link: {
        fontWeight: '700',
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    eyeIcon: {
        padding: 4,

    },
});

export default Login;
