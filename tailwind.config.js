/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*{html,js}"],
    safelist: [
        "!pt-0",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}