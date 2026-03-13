import axios from 'axios';

// Base URL for the API - can be easily changed as requested
const BASE_URL = 'https://api.spotride.com/v1';

export interface Location {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface Ride {
    id: string;
    pickup: Location;
    dropoff: Location;
    status: 'searching' | 'confirmed' | 'active' | 'completed';
    driver?: {
        name: string;
        rating: number;
        vehicle: string;
        plateNumber: string;
    };
}

const rideService = {
    /**
     * Search for locations based on a query
     */
    searchLocations: async (query: string): Promise<Location[]> => {
        try {
            // Mock API call
            // const response = await axios.get(`${BASE_URL}/locations/search?q=${query}`);
            // return response.data;
            
            return [
                { latitude: 6.5244, longitude: 3.3792, address: 'Ikeja, Nigeria' },
                { latitude: 6.4281, longitude: 3.4219, address: 'Lekki Phase 1, Nigeria' },
            ];
        } catch (error) {
            console.error('Error searching locations:', error);
            return [];
        }
    },

    /**
     * Request a ride
     */
    requestRide: async (pickup: Location, dropoff: Location): Promise<Ride | null> => {
        try {
            // Mock API call
            // const response = await axios.post(`${BASE_URL}/rides`, { pickup, dropoff });
            // return response.data;

            return {
                id: Math.random().toString(36).substr(2, 9),
                pickup,
                dropoff,
                status: 'searching'
            };
        } catch (error) {
            console.error('Error requesting ride:', error);
            return null;
        }
    },

    /**
     * Get real-time updates for a ride
     */
    getRideUpdates: (rideId: string, onUpdate: (ride: Ride) => void) => {
        // Mock real-time updates using interval
        const interval = setInterval(() => {
            // Simulate driver confirmation and movement
            onUpdate({
                id: rideId,
                status: 'confirmed',
                pickup: { latitude: 6.5244, longitude: 3.3792 },
                dropoff: { latitude: 6.4281, longitude: 3.4219 },
                driver: {
                    name: 'John Doe',
                    rating: 4.9,
                    vehicle: 'Toyota Corolla',
                    plateNumber: 'ABC-123-XY'
                }
            } as Ride);
        }, 3000);

        return () => clearInterval(interval);
    }
};

export default rideService;
