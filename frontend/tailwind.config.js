// tailwind.config.js
import { defineConfig } from 'tailwindcss';

export default defineConfig({
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
