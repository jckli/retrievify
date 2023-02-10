import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="shortcut icon" href="/favicon.ico" />
                <title>Retrievify</title>
                <meta
                    name="description"
                    content="Unlock the full potential of your music experience with Retrievify. Get insights into all your listening habits and see exactly how you've been spending your time listening to music on Spotify."
                />
            </Head>
            <div>
                <Component {...pageProps} />
            </div>
        </>
    );
}

export default MyApp;
