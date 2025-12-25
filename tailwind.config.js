/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00623B',
          hover: '#004d2e',
        },
        accent: {
          active: '#D4A574',
          inactive: '#71A791',
        },
        background: {
          light: '#FFFFFF',
          dark: '#121212',
        },
        surface: {
          light: '#F5F5F5',
          dark: '#1E1E1E',
        },
        text: {
          main: {
            light: '#1A1A1A',
            dark: '#FFFFFF',
          },
          muted: {
            light: '#666666',
            dark: '#A0A0A0',
          },
        },
        border: {
          light: '#E5E5E5',
          dark: '#333333',
        },
      },
    }
  },
  plugins: [],
}

