/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Modus-inspired color palette
        'background-primary': '#FFFFFF', // White main background
        'background-secondary': '#F7F8FA', // Light gray secondary background
        'background-accent': '#F2F5F9', // Very light blue accent background
        'background-dark': '#0A1E3A', // Deep navy for dark sections
        
        // Accent colors
        'accent-primary': '#0A1E3A', // Deep navy blue
        'accent-secondary': '#ED6A2E', // Orange accent color
        'accent-tertiary': '#3B72B9', // Medium blue
        'accent-light': '#E5ECF6', // Very light blue
        
        // Text colors
        'text-primary': '#0A1E3A', // Dark blue for primary text
        'text-secondary': '#4F5B6C', // Medium gray for secondary text
        'text-light': '#FFFFFF', // White text for dark backgrounds
        'text-muted': '#8A94A6', // Light gray for muted text
        
        // Border colors
        'border-light': '#E2E8F0', // Light border for light backgrounds
        'border-dark': '#2D3748', // Dark border for dark backgrounds
        'border-accent': '#ED6A2E', // Orange accent border
        
        // Status colors (keep these for functional consistency)
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'info': '#3B82F6',
        
        // Legacy names for backward compatibility
        'yellow-accent': '#ED6A2E',
        'yellow-light': '#FFF0AA',
        'card-light': '#FFFFFF',
        'card-dark': '#0A1E3A',
        'border-light': '#E2E8F0',
        'border-dark': '#2D3748',
        'primary-600': '#6C47FF',
        'primary-700': '#5639CC',
        'primary-50': '#F4F2FF',
        'success-700': '#027A48',
        'success-50': '#ECFDF3',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'sans-serif'],
        mono: ['var(--font-geist-mono)'],
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.4s ease-out',
        spin: 'spin 1s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      borderRadius: {
        'card': '0px', // Squared design as in the image
        'sm': '4px',
        'btn': '4px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 6px 15px rgba(0, 0, 0, 0.08)',
        'btn': '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
