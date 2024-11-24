/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}", "./src/app/components/**/*.{html,ts}"],
    theme: {
        extend: {},
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    primary: "#3b4252",
                    secondary: "#434c5e",
                    accent: "#88c0d0",
                    neutral: "#4c566a",
                    "base-100": "#2e3440",
                    info: "#5e81ac",
                    success: "#a3be8c",
                    warning: "#d08770",
                    error: "#bf616a",
                },
            },
        ],
    },
    plugins: [require("daisyui")],
};
