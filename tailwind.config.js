/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#dce6f0',
          200: '#bccfe3',
          300: '#8faecc',
          400: '#5e89b3',
          500: '#3d6f9c',
          600: '#2f5a83',
          700: '#284a6b',
          800: '#243d58',
          900: '#1e3248',
          950: '#121f2e',
        },
        teal: {
          50: '#eefbfa',
          100: '#d3f4f3',
          200: '#abe9e9',
          300: '#71d8da',
          400: '#3cbec1',
          500: '#26a1a6',
          600: '#218187',
          700: '#1f686e',
          800: '#1f545a',
          900: '#1d464c',
          950: '#0b2e33',
        },
        lavender: {
          50: '#f4f3fb',
          100: '#e9e7f6',
          200: '#d5d1ee',
          300: '#b7b0e2',
          400: '#9685d3',
          500: '#7b63c2',
          600: '#6b4fae',
          700: '#5b4191',
          800: '#4b3776',
          900: '#3f3061',
          950: '#261c3c',
        },
        accent: {
          50: '#fff4ed',
          100: '#ffe5d4',
          200: '#fec8aa',
          300: '#fda273',
          400: '#fb7a3d',
          500: '#f95c1a',
          600: '#ea430f',
          700: '#c2330e',
          800: '#9a2b14',
          900: '#7c2714',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(18, 31, 46, 0.08), 0 4px 24px -6px rgba(18, 31, 46, 0.06)',
        lift: '0 8px 30px -6px rgba(18, 31, 46, 0.16)',
        glow: '0 0 0 1px rgba(38, 161, 166, 0.15), 0 8px 32px -8px rgba(38, 161, 166, 0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out both',
        'fade-in': 'fadeIn 0.4s ease-out both',
        'scale-in': 'scaleIn 0.25s ease-out both',
        'slide-up': 'slideUp 0.3s ease-out both',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
