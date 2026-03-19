import "@/globals.css";
import Head from "./head";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Retrievify",
	description:
		"Unlock the full potential of your music experience with Retrievify. Get insights into all your listening habits and see exactly how you've been spending your time listening to music on Spotify",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<Head />
			<body className="dark"> {children}</body>
		</html>
	);
}
