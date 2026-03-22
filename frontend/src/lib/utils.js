// Utility functions for UI components

// Class name merger
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// Format date
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate unique ID
export function generateId() {
    return Math.random().toString(36).substring(2, 10);
}

// Debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if string is empty
export function isEmpty(value) {
    return value == null || value === '';
}

// Capitalize first letter
export function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text
export function truncate(str, length) {
    if (!str || typeof str !== 'string') return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
}

// Wait for a specified time
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Default export for convenience
const utils = {
    cn,
    formatDate,
    generateId,
    debounce,
    isEmpty,
    capitalize,
    truncate,
    wait
};

export default utils;
