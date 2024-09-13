/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "custom-yellow": "#FFD15B",
        "custom-grey": "#EDEDED",
        "custom-mid-grey": "#7A7A7A",
        "custom-light-grey": "#C6C6C6"
      },
      backgroundImage: {
        "header-background": "url('images/banner.png')",
      },
      aspectRatio: {
        "1440-667": "1440/667",
      },
      fontFamily: {
        'title': ['Anton', 'sans-serif'],
        'paragraph': ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'xl': '21px',
      }
    },
  },
  plugins: [],
};
