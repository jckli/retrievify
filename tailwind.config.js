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
        screens: {
            "navbar": "894px",
            "xsm": "460px",
            "sm": "640px",
            "md": "768px",
            "lg": "1024px",
            "xl": "1280px",
            "1.5xl": "1440px",
            "2xl": "1536px",
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
