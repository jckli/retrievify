module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: true, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: "#4ad3ff",
            },
            fontFamily: {
                proximaNova: ["Proxima Nova"],
                gotham: ["Gotham"],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
