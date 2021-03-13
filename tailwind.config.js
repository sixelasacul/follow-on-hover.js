module.exports = {
  purge: [
    "./docs/tailwind.css",
    "./docs/index.html"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['active']
    },
  },
  plugins: [],
}
