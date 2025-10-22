/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
      colors: {
        
       /* brand: {
          50: '#F5F7FF',
          100: '#EBEFFF',
          200: '#D8DEFF',
          500: '#4B62FF',   
          600: '#3C4ECC',
          700: '#2D3B99',
        },*/
        ink: {
          900: '#0F172A',   // titles
          700: '#334155',   // body
          500: '#64748B',   // secondary
        }
      },
      boxShadow: {
        card: '0 8px 24px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        xl: '14px',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 280ms ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
