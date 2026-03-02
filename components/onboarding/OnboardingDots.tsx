import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface OnboardingDotsProps {
    total: number;
    currentIndex: number;
}

export default function OnboardingDots({ total, currentIndex }: OnboardingDotsProps) {
    const animations = useRef(
        Array.from({ length: total }, (_, i) =>
            new Animated.Value(i === 0 ? 1 : 0)
        )
    ).current;

    useEffect(() => {
        animations.forEach((anim, i) => {
            Animated.spring(anim, {
                toValue: i === currentIndex ? 1 : 0,
                friction: 7,
                tension: 80,
                useNativeDriver: false,
            }).start();
        });
    }, [currentIndex]);

    return (
        <View style={styles.container}>
            {Array.from({ length: total }).map((_, i) => {
                const scale = animations[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.15],
                });

                const opacity = animations[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 1],
                });

                const dotWidth = animations[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 22],
                });

                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                width: dotWidth,
                                opacity,
                                transform: [{ scale }],
                                backgroundColor: i === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
});
