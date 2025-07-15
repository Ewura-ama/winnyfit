import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8000/api/products';

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

// Get all product categories
export const getProductCategories = async () => {
    try {
        const response = await axiosInstance.get('/categories/');
        return response.data;
    } catch (error) {
        console.error('Error fetching product categories:', error);
        throw error;
    }
};

// Get products with optional filters
export const getProducts = async (filters = {}) => {
    try {
        const response = await axiosInstance.get('/', { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Get featured products
export const getFeaturedProducts = async (limit = 4) => {
    try {
        const response = await axiosInstance.get('/', { 
            params: { 
                featured: true,
                limit: limit
            } 
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        throw error;
    }
};

// Get product details by ID
export const getProductDetails = async (productId) => {
    try {
        const response = await axiosInstance.get(`/${productId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product details for ID ${productId}:`, error);
        throw error;
    }
};

// Get product reviews
export const getProductReviews = async (productId) => {
    try {
        const response = await axiosInstance.get('/reviews/', {
            params: { product: productId }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for product ID ${productId}:`, error);
        throw error;
    }
};

// Add a product review
export const addProductReview = async (productId, reviewData) => {
    try {
        const response = await axiosInstance.post('/reviews/', {
            product: productId,
            rating: reviewData.rating,
            comment: reviewData.comment
        });
        return response.data;
    } catch (error) {
        console.error(`Error adding review for product ID ${productId}:`, error);
        throw error;
    }
};

// Create a new order
export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post('/orders/', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Get user orders
export const getUserOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders/');
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

// Get order details by ID
export const getOrderDetails = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/orders/${orderId}/`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order details for ID ${orderId}:`, error);
        throw error;
    }
};

// Cancel an order
export const cancelOrder = async (orderId) => {
    try {
        const response = await axiosInstance.post(`/orders/${orderId}/cancel/`);
        return response.data;
    } catch (error) {
        console.error(`Error canceling order ID ${orderId}:`, error);
        throw error;
    }
};

// Search products
export const searchProducts = async (query) => {
    try {
        const response = await axiosInstance.get('/', { 
            params: { search: query } 
        });
        return response.data;
    } catch (error) {
        console.error(`Error searching products with query "${query}":`, error);
        throw error;
    }
};

const productService = {
    getProductCategories,
    getProducts,
    getFeaturedProducts,
    getProductDetails,
    getProductReviews,
    addProductReview,
    createOrder,
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    searchProducts
};

export default productService; 