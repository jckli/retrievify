import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Privacy: NextPage = () => {
    const router = useRouter();
    return (
        <>
            <div className="mt-14 md:m-14 px-12 text-white font-metropolis max-w-[1000px]">
                <div className="text-white font-proximaNova font-semibold text-xl">
                    <a className="flex items-center hover:cursor-pointer" onClick={() => router.back()}>
                        <svg
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            height="1em"
                            className="h-[18px] min-w-[18px] rotate-180"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                        Back
                    </a>
                </div>
                <br />
                <h1 className="font-proximaNova font-bold text-4xl">Privacy Policy</h1>
                <p className="mt-3">
                    Statsify was developed as an open source app. This service is provided by the Statsify team at no
                    cost and is intended for use as is. This page is used to inform visitors regarding our policies with
                    the collection, use, and disclosure of Personal Information if anyone decided to use our Service.
                </p>
                <h2 className="font-proximaNova font-bold text-2xl mt-4">Information Collection and Use</h2>
                <p className="mt-3">
                    We do not store any information or data used by Statsify nor shared with third parties. However, for
                    a better experience, the data package feature is stored on your device&apos;s browser storage, in a
                    section called &quot;Local Storage&quot;. This data is not stored on our servers, and can be deleted
                    at any time by clearing your browser cookies and data for the site. All information is used solely
                    for displaying statistics and information on the website. By choosing to use this app, you agree to
                    the use of your Spotify account data for the purposes of this app.
                </p>
                <h2 className="font-proximaNova font-bold text-2xl mt-4">Deletion of Data</h2>
                <p className="mt-3">
                    Although your data is not being stored server-sided or used maliciously, if you would like to revoke
                    Statsify&apos;s permissions,{" "}
                    <a
                        className="inline-block underline underline-offset-2"
                        href="https://support.spotify.com/us/article/spotify-on-other-apps/"
                    >
                        here
                    </a>{" "}
                    is a guide for doing so. To delete your data package data from your browser, simply clear your
                    browser&apos;s cookies and data for the site.
                </p>
                <h2 className="font-proximaNova font-bold text-2xl mt-4">Contact Us</h2>
                <p className="mt-3">
                    If you have any questions or suggestions about our Privacy Policy, feel free to contact us at:{" "}
                    <a className="inline-block underline underline-offset-2" href="mailto:support@hayasaka.moe">
                        support@hayasaka.moe
                    </a>
                </p>
                <p className="mt-3">
                    Or if you prefer to use Discord, you can join our Discord server here:{" "}
                    <a className="inline-block underline underline-offset-2" href="https://jackli.dev/discord">
                        https://jackli.dev/discord
                    </a>
                </p>
            </div>
        </>
    );
};

export default Privacy;
