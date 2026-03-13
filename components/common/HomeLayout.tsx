import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from './Sidebar';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

interface HomeLayoutProps {
    children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const translateX = useSharedValue(-DRAWER_WIDTH);

    const toggleDrawer = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        translateX.value = withSpring(nextState ? 0 : -DRAWER_WIDTH, {
            damping: 20,
            stiffness: 90,
        });
    };

    const drawerStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const contentStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            translateX.value,
            [-DRAWER_WIDTH, 0],
            [1, 0.9],
            Extrapolate.CLAMP
        );
        const borderRadius = interpolate(
            translateX.value,
            [-DRAWER_WIDTH, 0],
            [0, 20],
            Extrapolate.CLAMP
        );

        return {
            transform: [{ scale }],
            borderRadius,
        };
    });

    const overlayStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [-DRAWER_WIDTH, 0],
            [0, 0.5],
            Extrapolate.CLAMP
        );

        return {
            opacity,
            pointerEvents: isOpen ? 'auto' : 'none',
        };
    });

    return (
        <View style={styles.container}>
            {/* Sidebar */}
            <Animated.View style={[styles.drawer, drawerStyle]}>
                <Sidebar
                    onClose={toggleDrawer}
                    currentMode="passenger"
                    onSwitchMode={() => {}}
                />
            </Animated.View>

            {/* Main Content */}
            <Animated.View style={[styles.content, contentStyle]}>
                {children}

                {/* Drawer Toggle Button (Hamburger) */}
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={toggleDrawer}
                >
                    <Ionicons name="menu" size={30} color="#FFF" />
                </TouchableOpacity>

                {/* Overlay to close drawer */}
                <Animated.View style={[styles.overlay, overlayStyle]}>
                    <TouchableOpacity
                        style={styles.overlayTouch}
                        onPress={toggleDrawer}
                        activeOpacity={1}
                    />
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: DRAWER_WIDTH,
        height: '100%',
        zIndex: 100,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    menuButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F97316',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 5,
    },
    overlayTouch: {
        flex: 1,
    },
});

export default HomeLayout;
