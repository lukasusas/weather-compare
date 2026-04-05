/** @type {import('tailwindcss').Config} */
const path = require('path');
const projectRoot = __dirname;

module.exports = {
  content: [
    path.join(projectRoot, 'pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(projectRoot, 'components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(projectRoot, 'app/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
      },
    },
  },
  plugins: [],
}
