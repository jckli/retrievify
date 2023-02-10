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
                    content="View all your listening statistics for Spotify and see how you've spent your time listening to music with Retrievify."
                />
            </Head>
            <div>
                <Component {...pageProps} />
            </div>
        </>
    );
}

export default MyApp;
