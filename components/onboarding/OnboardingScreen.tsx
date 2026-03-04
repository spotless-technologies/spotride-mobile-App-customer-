import React, { useCallback, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';
import OnboardingControls from './OnboardingControls';
import OnboardingSlide, { SlideData } from './OnboardingSlide';

const { width } = Dimensions.get('window');

const SLIDES: SlideData[] = [
    {
        id: 'welcome',
        title: 'Ride Anywhere, Anytime',
        subtitle: 'Safe, Reliable & Affordable',
        backgroundColor: '#111218',
        imageSource: require('@/assets/images/onboarding/slide1.png'),
    },
    {
        id: 'ride',
        title: 'Your Choice, Your Price',
        subtitle: 'Flexible commuting for everyone',
        backgroundColor: '#111218',
        imageSource: require('@/assets/images/onboarding/slide2.png'),
    },
    {
        id: 'rent',
        title: 'Car Rentals & Logistics',
        subtitle: 'Premium fleet at your fingertips',
        backgroundColor: '#111218',
        imageSource: require('@/assets/images/onboarding/slide3.png'),
    },
    {
        id: 'secure',
        title: 'Safe & Secure Travels',
        subtitle: 'Verified drivers, GPS tracking',
        backgroundColor: '#111218',
        imageSource: require('@/assets/images/onboarding/slide4.png'),
    },
];

interface OnboardingScreenProps {
    onDone: () => void;
}

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList<SlideData>>(null);

    const markOnboarded = useCallback(() => {
        onDone();
    }, [onDone]);

    const handleNext = useCallback(() => {
        if (currentIndex < SLIDES.length - 1) {
            const nextIndex = currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        } else {
            markOnboarded();
        }
    }, [currentIndex, markOnboarded]);

    const handleSkip = useCallback(() => {
        markOnboarded();
    }, [markOnboarded]);

    const onMomentumScrollEnd = useCallback(
        (e: NativeSyntheticEvent<NativeScrollEvent>) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
        },
        []
    );

    const renderSlide = useCallback(
        ({ item }: { item: SlideData }) => <OnboardingSlide slide={item} />,
        []
    );

    const isLastSlide = currentIndex === SLIDES.length - 1;

    return (
        <View style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onMomentumScrollEnd={onMomentumScrollEnd}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                bounces={false}
                decelerationRate="fast"
            />

            <OnboardingControls
                total={SLIDES.length}
                currentIndex={currentIndex}
                isLastSlide={isLastSlide}
                onSkip={handleSkip}
                onNext={handleNext}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111218',
    },
});
