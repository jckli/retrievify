const config = {
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	prefix: "",
	darkMode: ["class"],
	container: {
		screens: {
			"navbar": "894px",
			"xxsm": "380px",
			"xsm": "460px",
			"sxsm": "510px",
			"sm": "640px",
			"md": "768px",
			"mlg": "894px",
			"lg": "1024px",
			"xl": "1280px",
			"1.5xl": "1440px",
			"2xl": "1536px",
		},
	},
};

export default config;
