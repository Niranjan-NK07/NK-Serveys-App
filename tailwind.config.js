/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // adjust if your client folder is deeper
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwind-scrollbar"), // add scrollbar plugin here
  ],
};
