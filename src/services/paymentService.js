import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8000/api/payments';

// Configure axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 15000,
});

// Add auth token to requests
axiosInstance.interceptors.request.use(
    config => {
        const user = authService.getCurrentUser();
        if (user && user.access) {
            config.headers['Authorization'] = `Bearer ${user.access}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Create a payment
export const createPayment = async (paymentData) => {
    try {
        const response = await axiosInstance.post('/', {
            amount: paymentData.amount,
            payment_method: paymentData.paymentMethod,
            payment_type: paymentData.paymentType
        });
        return response.data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

// Process a payment
export const processPayment = async (paymentId) => {
    try {
        const response = await axiosInstance.post(`/${paymentId}/process/`);
        return response.data;
    } catch (error) {
        console.error(`Error processing payment ID ${paymentId}:`, error);
        throw error;
    }
};

// Refund a payment
export const refundPayment = async (paymentId) => {
    try {
        const response = await axiosInstance.post(`/${paymentId}/refund/`);
        return response.data;
    } catch (error) {
        console.error(`Error refunding payment ID ${paymentId}:`, error);
        throw error;
    }
};

// Get user payments
export const getUserPayments = async () => {
    try {
        const response = await axiosInstance.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching user payments:', error);
        throw error;
    }
};

// Get payment details by ID
export const getPaymentDetails = async (paymentId) => {
    try {
        const response = await axiosInstance.get(`/${paymentId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching payment details for ID ${paymentId}:`, error);
        throw error;
    }
};

// Verify payment (simulating payment gateway callback)
export const verifyPayment = async (paymentId, transactionId) => {
    try {
        const response = await axiosInstance.post(`/${paymentId}/verify/`, {
            transaction_id: transactionId
        });
        return response.data;
    } catch (error) {
        console.error(`Error verifying payment ID ${paymentId}:`, error);
        throw error;
    }
};

// Get payment methods
export const getPaymentMethods = () => {
    return [
        { id: 'card', name: 'Credit/Debit Card', icon: 'credit-card' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: 'university' },
        { id: 'cash', name: 'Cash', icon: 'money-bill' },
        { id: 'mobile_money', name: 'Mobile Money', icon: 'mobile-alt' }
    ];
};

const paymentService = {
    createPayment,
    processPayment,
    refundPayment,
    getUserPayments,
    getPaymentDetails,
    verifyPayment,
    getPaymentMethods
};

export default paymentService; 