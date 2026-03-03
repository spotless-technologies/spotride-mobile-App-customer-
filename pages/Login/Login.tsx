import { useToast } from '@/components/common/ToastContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const Login = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const { showToast } = useToast();

    const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('login_token');
                const userId = await AsyncStorage.getItem('userId');

                if (!token && !userId) {
                    // No auth data found, redirect to signup
                    router.replace('/signup');
                } else {
                    setIsCheckingAuth(false);
                }
            } catch (error) {
                console.error('Error checking auth status:', error);
                setIsCheckingAuth(false);
            }
        };

        checkAuthStatus();
    }, []);

    if (isCheckingAuth) {
        return <View style={[styles.container, { backgroundColor: themeColors.background }]} />;
    }

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

    const handleLogin = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const identifier = loginType === 'email' ? email : phone;
            const response = await authService.login(identifier, password);

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
                        <Text style={styles.title}>Welcome to SpotRide</Text>
                        <Text style={styles.subtitle}>Get there faster, safer, and smarter.</Text>
                    </View>
                </View>

                <View style={styles.formContainer}>
                    <View style={[styles.tabContainer, { backgroundColor: '#F0F0F0' }]}>
                        <TouchableOpacity
                            style={[styles.tab, loginType === 'email' && styles.activeTab]}
                            onPress={() => setLoginType('email')}
                        >
                            <Ionicons name="mail-outline" size={20} color={loginType === 'email' ? themeColors.primary : '#888'} />
                            <Text style={[styles.tabText, loginType === 'email' && { color: themeColors.primary }]}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, loginType === 'phone' && styles.activeTab]}
                            onPress={() => setLoginType('phone')}
                        >
                            <Ionicons name="call-outline" size={20} color={loginType === 'phone' ? themeColors.primary : '#888'} />
                            <Text style={[styles.tabText, loginType === 'phone' && { color: themeColors.primary }]}>Phone</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.text }]}>
                            {loginType === 'email' ? 'Email Address' : 'Phone Number'} <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.email || errors.phone ? { borderColor: 'red' } : { borderColor: '#E0E0E0' }]}>
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                placeholder={loginType === 'email' ? 'merchant@example.com' : '08012345678'}
                                placeholderTextColor="#999"
                                value={loginType === 'email' ? email : phone}
                                onChangeText={loginType === 'email' ? setEmail : setPhone}
                                keyboardType={loginType === 'email' ? 'email-address' : 'phone-pad'}
                                autoCapitalize="none"
                            />
                        </View>
                        {(errors.email || errors.phone) && <Text style={styles.errorText}>{errors.email || errors.phone}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.text }]}>Password <Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={[styles.inputWrapper, errors.password ? { borderColor: 'red' } : { borderColor: '#E0E0E0' }]}>
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                placeholder="Enter your password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <Ionicons
                                name={rememberMe ? "checkbox" : "square-outline"}
                                size={22}
                                color={rememberMe ? themeColors.primary : '#888'}
                            />
                            <Text style={[styles.checkboxLabel, { color: themeColors.text }]}>Remember me</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => showToast('Forgot password logic placeholder', 'info')}>
                            <Text style={[styles.forgotPassword, { color: themeColors.primary }]}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginButtonText}>{isLoading ? 'Logging In...' : 'Login'}</Text>
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>Or continue with</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: themeColors.text }]}>
                            Don't have an account?{' '}
                            <Text
                                style={[styles.link, { color: themeColors.primary }]}
                                onPress={() => router.push('/signup')}
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
        paddingTop: 40,
    },
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 30,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    tabText: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: '#888',
    },
    inputGroup: {
        marginBottom: 20,
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
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
    },
    forgotPassword: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FF701F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEE',
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#999',
        fontSize: 12,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '47%',
        height: 50,
        borderWidth: 1,
        borderColor: '#EEE',
        borderRadius: 12,
        backgroundColor: '#FFF',
    },
    socialText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    footer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    footerText: {
        fontSize: 16,
    },
    link: {
        fontWeight: 'bold',
    },
});

export default Login;
