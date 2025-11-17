/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "twilight-indigo": {
          "50": "#eff0f5",
          "100": "#e0e2eb",
          "200": "#c1c5d7",
          "300": "#a2a8c3",
          "400": "#838baf",
          "500": "#636e9c",
          "600": "#50587c",
          "700": "#3c425d",
          "800": "#282c3e",
          "900": "#14161f",
          "950": "#0e0f16"
        },
        "powder-blue": {
          "50": "#ebf0fa",
          "100": "#d6e2f5",
          "200": "#adc5eb",
          "300": "#85a8e0",
          "400": "#5c8bd6",
          "500": "#336ecc",
          "600": "#2958a3",
          "700": "#1f427a",
          "800": "#142c52",
          "900": "#0a1629",
          "950": "#070f1d"
        },
        "powder-petal": {
          "50": "#fcf1e8",
          "100": "#fae3d1",
          "200": "#f5c7a3",
          "300": "#f0aa75",
          "400": "#eb8e47",
          "500": "#e67219",
          "600": "#b85b14",
          "700": "#8a440f",
          "800": "#5c2e0a",
          "900": "#2e1705",
          "950": "#201004"
        },
        "powder-blush": {
          "50": "#faedea",
          "100": "#f5dbd6",
          "200": "#ebb7ad",
          "300": "#e19384",
          "400": "#d7705b",
          "500": "#cd4c32",
          "600": "#a43d28",
          "700": "#7b2d1e",
          "800": "#521e14",
          "900": "#290f0a",
          "950": "#1d0b07"
        },
        "ash-brown": {
          "50": "#f5f1f0",
          "100": "#ebe4e0",
          "200": "#d7c8c1",
          "300": "#c3ada2",
          "400": "#ae9284",
          "500": "#9a7765",
          "600": "#7b5f51",
          "700": "#5d473c",
          "800": "#3e2f28",
          "900": "#1f1814",
          "950": "#16110e"
        },
        bookshelf: {
          paper: '#f5f1f0', // Ash brown 50
          leather: '#7b5f51', // Ash brown 600
          wood: '#9a7765', // Ash brown 500
          ink: '#14161f', // Twilight indigo 900
          accent: '#e67219', // Powder petal 500
          dark: {
            bg: '#282c3e', // Twilight indigo 800
            card: '#3c425d', // Twilight indigo 700
            accent: '#eb8e47', // Powder petal 400
            text: '#f5f1f0', // Ash brown 50
            muted: '#c1c5d7', // Twilight indigo 200
            border: '#50587c', // Twilight indigo 600
          },
          light: {
            bg: '#eff0f5', // Twilight indigo 50
            card: '#ffffff', // White
            accent: '#e67219', // Powder petal 500
            text: '#282c3e', // Twilight indigo 800
            muted: '#636e9c', // Twilight indigo 500
            border: '#e0e2eb', // Twilight indigo 100
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'book': '0 5px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'book-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'book': '3px 10px 10px 3px',
      },
    },
  },
  plugins: [],
}
