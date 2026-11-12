// PostCSS runs over our CSS at build time; this plugin is what makes Tailwind work.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
