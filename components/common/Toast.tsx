import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type: ToastType;
    onHide: () => void;
    visible: boolean;
}

const { width } = Dimensions.get('window');

const Toast: React.FC<ToastProps> = ({ message, type, onHide, visible }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [translateY] = useState(new Animated.Value(-100));

    const [isRendered, setIsRendered] = useState(visible);

    useEffect(() => {
        if (visible) {
            setIsRendered(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(translateY, {
                    toValue: 20,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                hideToast();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            hideToast();
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
            setIsRendered(false);
        });
    };

    if (!isRendered) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '#E8F5E9'; // Light green
            case 'error': return '#FFEBEE'; // Light red
            case 'info': return '#E3F2FD'; // Light blue
            default: return '#F5F5F5';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'error': return '#F44336';
            case 'info': return '#2196F3';
            default: return '#BDBDBD';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success': return '#2E7D32';
            case 'error': return '#C62828';
            case 'info': return '#1565C0';
            default: return '#424242';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success': return 'checkmark-circle';
            case 'error': return 'alert-circle';
            case 'info': return 'information-circle';
            default: return 'information-circle';
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                },
            ]}
        >
            <View style={styles.content}>
                <Ionicons name={getIcon()} size={20} color={getTextColor()} style={styles.icon} />
                <Text style={[styles.text, { color: getTextColor() }]}>{message}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        zIndex: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
        textAlign: 'center',
    },
});

export default Toast;
