import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');
const SHEET_HEIGHT = height * 0.45;

interface DestinationSearchProps {
    onFindVehicles: () => void;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({ onFindVehicles }) => {
    return (
        <View style={styles.container}>
            {/* Drag Handle */}
            <View style={styles.handle} />

            <View style={styles.content}>
                <Text style={styles.title}>Where are you going?</Text>
                <Text style={styles.subtitle}>Choose your destination</Text>

                {/* Input Section */}
                <View style={styles.inputSection}>
                    <View style={styles.inputWrapper}>
                        <View style={styles.iconColumn}>
                            <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
                            <View style={styles.line} />
                            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                        </View>

                        <View style={styles.inputs}>
                            <TextInput
                                style={styles.input}
                                placeholder="Pickup"
                                placeholderTextColor="#AAA"
                            />
                            <View style={styles.separator} />
                            <TextInput
                                style={styles.input}
                                placeholder="Drop-off"
                                placeholderTextColor="#AAA"
                            />
                        </View>

                        <TouchableOpacity style={styles.swapButton}>
                            <Ionicons name="swap-vertical" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.chooseOnMap}>
                        <Ionicons name="location-outline" size={20} color="#333" />
                        <Text style={styles.chooseOnMapText}>Choose on map</Text>
                    </TouchableOpacity>
                </View>

                {/* Find Vehicles Button */}
                <TouchableOpacity style={styles.findButton} onPress={onFindVehicles}>
                    <Text style={styles.findButtonText}>Find Vehicles</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        width: '100%',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 20,
            },
        }),
    },
    handle: {
        width: 60,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    content: {
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    inputSection: {
        marginTop: 24,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    iconColumn: {
        alignItems: 'center',
        marginRight: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    line: {
        width: 1,
        height: 30,
        backgroundColor: '#E5E7EB',
        marginVertical: 4,
        borderStyle: 'dashed',
    },
    inputs: {
        flex: 1,
    },
    input: {
        fontSize: 16,
        color: '#111',
        height: 40,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    swapButton: {
        marginLeft: 12,
    },
    chooseOnMap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    chooseOnMapText: {
        fontSize: 15,
        color: '#333',
        marginLeft: 8,
        fontWeight: '500',
    },
    findButton: {
        backgroundColor: '#F97316',
        borderRadius: 30,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        ...Platform.select({
            ios: {
                shadowColor: '#F97316',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    findButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DestinationSearch;
