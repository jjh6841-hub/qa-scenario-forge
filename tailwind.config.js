/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'pulse-blue': 'pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pop-in': 'pop-in 0.3s ease-out forwards',
        'fill-gauge': 'fill-gauge 1s ease-out forwards',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      keyframes: {
        'pulse-blue': {
          '0%, 100%': { opacity: '1', backgroundColor: 'rgb(59 130 246)' },
          '50%': { opacity: '0.5', backgroundColor: 'rgb(147 197 253)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fill-gauge': {
          '0%': { 'stroke-dashoffset': '251' },
          '100%': { 'stroke-dashoffset': 'var(--gauge-offset)' },
        },
        'skeleton': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },
  plugins: [],
};
