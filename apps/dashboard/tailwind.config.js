/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#0a0a0c',
          900: '#121216',
          800: '#1c1c24',
          700: '#2a2a35',
          cyan: '#00d4ff',
          alert: '#ff3e3e',
          warning: '#ff9f1c',
          success: '#00f5a0'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
