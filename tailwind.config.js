// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Additional configurations here
    },
  },
  plugins: [],
  extend: {
    utilities: {
      '.scrollbar-hide': {
        /* Hide scrollbar for modern browsers */
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        '-ms-overflow-style': 'none', /* IE and Edge */
        'scrollbar-width': 'none', /* Firefox */
      },
    },
  },
};
