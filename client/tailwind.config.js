/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#09090b', // Zinc 950
                surface: '#18181b', // Zinc 900
                primary: '#3b82f6', // Blue 500 (Adjust as needed for premium feel)
                secondary: '#8b5cf6', // Violet 500
                accent: '#f43f5e', // Rose 500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
