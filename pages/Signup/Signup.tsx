import { useToast } from '@/components/common/ToastContext';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/services/authService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        if (!fullName) newErrors.fullName = 'Full Name is required';
        if (signupType === 'email') {
            if (!email) newErrors.email = 'Email Address is required';
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email Address is invalid';
        } else {
            if (!phone) newErrors.phone = 'Phone Number is required';
        }
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
                mode: mode || 'passenger'
            };
            const response = await authService.signUp(data);
            if (response.success) {
                showToast(response.message, 'success');
                setTimeout(() => {
                    router.push({
                        pathname: '/verify',
                        params: { identifier: data.identifier }
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
                            style={[styles.tab, signupType === 'email' && styles.activeTab]}
                            onPress={() => setSignupType('email')}
                        >
                            <Ionicons name="mail-outline" size={20} color={signupType === 'email' ? themeColors.primary : '#888'} />
                            <Text style={[styles.tabText, signupType === 'email' && { color: themeColors.primary }]}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, signupType === 'phone' && styles.activeTab]}
                            onPress={() => setSignupType('phone')}
                        >
                            <Ionicons name="call-outline" size={20} color={signupType === 'phone' ? themeColors.primary : '#888'} />
                            <Text style={[styles.tabText, signupType === 'phone' && { color: themeColors.primary }]}>Phone</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.text }]}>Full Name <Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={[styles.inputWrapper, errors.fullName ? { borderColor: 'red' } : { borderColor: '#E0E0E0' }]}>
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                placeholder="John Doe"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.text }]}>
                            {signupType === 'email' ? 'Email Address' : 'Phone Number'} <Text style={{ color: 'red' }}>*</Text>
                        </Text>
                        <View style={[styles.inputWrapper, errors.email || errors.phone ? { borderColor: 'red' } : { borderColor: '#E0E0E0' }]}>
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                placeholder={signupType === 'email' ? 'business@example.com' : '08012345678'}
                                placeholderTextColor="#999"
                                value={signupType === 'email' ? email : phone}
                                onChangeText={signupType === 'email' ? setEmail : setPhone}
                                keyboardType={signupType === 'email' ? 'email-address' : 'phone-pad'}
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
                                placeholder="Create a strong password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: themeColors.text }]}>Confirm Password <Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={[styles.inputWrapper, errors.confirmPassword ? { borderColor: 'red' } : { borderColor: '#E0E0E0' }]}>
                            <TextInput
                                style={[styles.input, { color: themeColors.text }]}
                                placeholder="Confirm your password"
                                placeholderTextColor="#999"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                    </View>

                    <TouchableOpacity
                        style={[styles.signupButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleSignup}
                        disabled={isLoading}
                    >
                        <Text style={styles.signupButtonText}>{isLoading ? 'Creating Account...' : 'Sign Up'}</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: themeColors.text }]}>
                            Already have an account?{' '}
                            <Text
                                style={[styles.link, { color: themeColors.primary }]}
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
    signupButton: {
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        alignItems: 'center',
        marginVertical: 40,
    },
    footerText: {
        fontSize: 16,
    },
    link: {
        fontWeight: 'bold',
    },
});

export default Signup;
