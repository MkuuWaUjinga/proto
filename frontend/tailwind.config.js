/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'proto-black': '#000814',
        'proto-dark-blue': '#001D3D',
        'proto-light-blue': '#003566',
        'proto-gold': '#FFC300',
        'proto-yellow': '#FFD60A',
        'proto-white': '#e7ecef'
      },
    },
  },
  plugins: [],
}
