/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
        },
        success: {
          DEFAULT: 'var(--success)',
          hover: 'var(--success-hover)',
          light: 'var(--success-light)',
          dark: 'var(--success-dark)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          hover: 'var(--warning-hover)',
          light: 'var(--warning-light)',
          dark: 'var(--warning-dark)',
        },
        error: {
          DEFAULT: 'var(--error)',
          hover: 'var(--error-hover)',
          light: 'var(--error-light)',
          dark: 'var(--error-dark)',
        },
      },
      backgroundColor: {
        dark: {
          primary: '#1a1a1a',
          secondary: '#2d2d2d',
          accent: '#3d3d3d',
          elevated: '#404040',
          'elevated-hover': '#4a4a4a',
          card: '#2a2a2a',
          'card-hover': '#333333',
          input: '#262626',
          'input-focus': '#333333',
        },
      },
      textColor: {
        dark: {
          primary: '#ffffff',
          secondary: '#e0e0e0',
          muted: '#a0a0a0',
          'muted-hover': '#b0b0b0',
          accent: '#00D1C1',
        },
      },
      borderColor: {
        dark: {
          primary: '#404040',
          secondary: '#333333',
          accent: '#4a4a4a',
          input: '#363636',
          'input-focus': '#4a4a4a',
        },
      },
      boxShadow: {
        'soft-xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'soft-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'soft-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 8px 12px rgba(0, 0, 0, 0.1)',
        'soft-xl': '0 12px 16px rgba(0, 0, 0, 0.1)',
        'soft-2xl': '0 16px 24px rgba(0, 0, 0, 0.1)',
        'soft-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        'dark-xs': '0 1px 2px rgba(0, 0, 0, 0.8)',
        'dark-sm': '0 1px 3px rgba(0, 0, 0, 0.8)',
        'dark': '0 2px 4px rgba(0, 0, 0, 0.8)',
        'dark-md': '0 4px 6px rgba(0, 0, 0, 0.8)',
        'dark-lg': '0 8px 12px rgba(0, 0, 0, 0.8)',
        'dark-xl': '0 12px 16px rgba(0, 0, 0, 0.8)',
        'dark-2xl': '0 16px 24px rgba(0, 0, 0, 0.8)',
        'dark-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.8)',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text|border)-(primary|secondary|accent|success|warning|error)/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
  ],
}