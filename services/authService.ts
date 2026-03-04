/**
 * Mock Auth Service
 * This service handles authentication logic and is designed to be easily swappable with a real API.
 */

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const authService = {
    /**
     * Mock signup endpoint
     */
    signUp: async (data: any): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock success for any data for now
                resolve({
                    success: true,
                    message: 'Account created successfully!',
                    data: { id: '123', ...data }
                });
            }, 1000);
        });
    },

    /**
     * Mock login endpoint
     */
    login: async (identifier: string, password: string): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock success if identifier is not empty
                if (identifier && password) {
                    resolve({
                        success: true,
                        message: 'Login successful!',
                        data: { id: '123', email: identifier, token: 'mock-jwt-token' }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid credentials. Please try again.'
                    });
                }
            }, 1000);
        });
    },

    /**
     * Mock token verification endpoint
     */
    verifyToken: async (code: string): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock success if code is 123456
                if (code === '123456') {
                    resolve({
                        success: true,
                        message: 'Account verified successfully!',
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid verification code.'
                    });
                }
            }, 1000);
        });
    },

    /**
     * Mock resend verification code
     */
    resendCode: async (identifier: string): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Verification code resent successfully!'
                });
            }, 1000);
        });
    },

    /**
     * Mock forgot password request
     */
    forgotPassword: async (identifier: string): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Password reset code sent successfully!'
                });
            }, 1000);
        });
    },

    /**
     * Mock reset password
     */
    resetPassword: async (code: string, password: string): Promise<AuthResponse> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (code === '123456') {
                    resolve({
                        success: true,
                        message: 'Password reset successfully!'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid reset code.'
                    });
                }
            }, 1000);
        });
    }
};
