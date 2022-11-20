module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: true, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                primary: "#4ad3ff",
                mgray: "#202020",
            },
            fontFamily: {
                proximaNova: ["ProximaNova"],
                metropolis: ["Metropolis"],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
