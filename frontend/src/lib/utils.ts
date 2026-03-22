// Utility functions for UI components

// Class name merger
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

// Format date
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Generate unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 10);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if value is empty
export function isEmpty(value: any): boolean {
    return value == null || value === '';
}

// Capitalize first letter
export function capitalize(str: string): string {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text
export function truncate(str: string, length: number): string {
    if (!str || typeof str !== 'string') return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
}

// Wait for specified time
export const wait = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

// Default export
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
