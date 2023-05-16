/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
    theme: {
        screens: {
            portable: '400px',
            tablet: '640px',
            littlelaptop: '900px',
            laptop: '1024px',
            desktop: '1280px',
            large: '1536px',
        },
        fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
        },
        extend: {},
    },
    plugins: [],
};
