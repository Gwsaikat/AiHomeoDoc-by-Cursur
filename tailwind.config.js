/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      scale: {
        '120': '1.2',
        '130': '1.3',
        '140': '1.4',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      transitionDelay: {
        '2000': '2000ms',
        '4000': '4000ms',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-red-100',
    'bg-yellow-100',
    'bg-indigo-100',
    'text-blue-500',
    'text-green-500',
    'text-purple-500',
    'text-red-500',
    'text-yellow-500',
    'text-indigo-500',
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-red-50',
    'bg-yellow-50',
    'bg-indigo-50',
    'animation-delay-2000',
    'animation-delay-4000',
    'scale-120',
    'scale-130',
    'scale-140',
    'scale-150',
  ],
} 