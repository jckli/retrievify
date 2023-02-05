import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import { ProgressBar } from "../../../components/ProgressBar";
import { getCookie, setCookie } from "cookies-next";

const SongIndex: NextPage = (props: any) => {
    const router = useRouter();
    const { artist } = router.query;
    const [trackId, setTrackId] = useState(artist);
    const fetcher = (url: any) => fetch(url).then(r => r.json());
    useEffect(() => {
        if (!router.isReady) return;
        const { track } = router.query;
        setTrackId(track);
    }, [router.isReady, router.query]);

    const data = props.track.data;
    const afData = props.audioFeatures.data;

    if (!data || !afData) {
        return (
            <>
                <Sidebar />
                <div className="navbar:ml-[280px] flex font-metropolis text-white">
                    <div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
                        Failed to load track data.
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Sidebar />
            <div className="navbar:ml-[280px] flex font-metropolis text-white">
                <div className="m-8 flex flex-col 1.5xl:flex-row w-[100%] overflow-auto">
                    <div className="1.5xl:w-[30%] flex flex-col md:flex-row 1.5xl:flex-col">
                        <div className="flex justify-center items-center md:w-[50%] 1.5xl:w-auto">
                            <div
                                id="artist"
                                className="bg-mgray rounded-md  1.5xl:w-auto 1.5xl:min-w-[50%] h-fit flex items-center justify-center"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col items-center xsm:text-center w-fit">
                                        <div className="m-auto xsm:mx-0">
                                            <div className="relative h-[256px] w-[256px]">
                                                <Image
                                                    alt="albumArt"
                                                    draggable={false}
                                                    src={data.album.images[0].url}
                                                    layout="fill"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <h1 className="text-4xl">{data.name}</h1>
                                            <p>{data.artists.map((artist: any) => artist.name).join(", ")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-[100%] justify-between">
                            <div
                                id="open-on-spotify"
                                className="bg-mgray 1.5xl:w-auto md:ml-8 1.5xl:ml-0 rounded-md mt-8 md:mt-0 1.5xl:mt-8 h-fi hover:bg-[#404040] ease-in-out duration-100"
                            >
                                <a href={data.external_urls.spotify}>
                                    <div className="p-5 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faSpotify} size="2x" />
                                        <h1 className="ml-2">Open on Spotify</h1>
                                    </div>
                                </a>
                            </div>
                            <div id="followers" className="bg-mgray md:ml-8 1.5xl:ml-0 rounded-md mt-8 h-fit">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-3xl">Song Duration</h1>
                                    <div className="mt-4">
                                        <h1 className="text-2xl">{formatMilliseconds(data.duration_ms)}</h1>
                                    </div>
                                </div>
                            </div>
                            <div id="popularity" className="bg-mgray md:ml-8 1.5xl:ml-0 rounded-md mt-8 h-fit">
                                <div className="p-5">
                                    <div className="flex items-center justify-between sm:justify-start">
                                        <h1 className="font-proximaNova text-3xl">Popularity</h1>
                                    </div>
                                    <div className="mt-4">
                                        <h1 className="text-2xl">{data.popularity / 10}</h1>
                                        <p>From 0-10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="1.5xl:w-[70%] flex flex-col 1.5xl:ml-8">
                        <div id="audio-features" className="mt-8 1.5xl:mt-0 flex gap-4 flex-wrap justify-center">
                            <div id="acoustic" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Acoustic</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={afData.acousticness * 100} />
                                        <p className="mt-1 text-sm">{(afData.acousticness * 100).toFixed(1)}/100</p>
                                    </div>
                                </div>
                            </div>
                            <div id="danceable" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Danceable</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={afData.danceability * 100} />
                                        <p className="mt-1 text-sm">{(afData.danceability * 100).toFixed(1)}/100</p>
                                    </div>
                                </div>
                            </div>
                            <div id="energetic" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Energetic</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={afData.energy * 100} />
                                        <p className="mt-1 text-sm">{(afData.energy * 100).toFixed(1)}/100</p>
                                    </div>
                                </div>
                            </div>
                            <div id="instrumental" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Instrumental</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={afData.instrumentalness * 100} />
                                        <p className="mt-1 text-sm">{(afData.instrumentalness * 100).toFixed(1)}/100</p>
                                    </div>
                                </div>
                            </div>
                            <div id="Lively" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Lively</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={afData.liveness * 100} />
                                        <p className="mt-1 text-sm">{(afData.liveness * 100).toFixed(1)}/100</p>
                                    </div>
                                </div>
                            </div>
                            <div id="speechful" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Speechful</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={afData.speechiness * 100} />
                                        <p className="mt-1 text-sm">{(afData.speechiness * 100).toFixed(1)}/100</p>
                                    </div>
                                </div>
                            </div>
                            <div id="valence" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Valence</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={afData.valence * 100} />
                                        <p className="mt-1 text-sm">{(afData.valence * 100).toFixed(1)}/100</p>
                                    </div>
                                </div>
                            </div>
                            <div id="popularity" className="bg-mgray rounded-md w-full sxsm:w-auto">
                                <div className="p-5">
                                    <h1 className="font-proximaNova text-xl">Popularity</h1>
                                    <div className="mt-2 w-full sxsm:w-[175px]">
                                        <ProgressBar progress={data.popularity} />
                                        <p className="mt-1 text-sm">{data.popularity}/100</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="album" className="mt-8 bg-mgray rounded-md">
                            <div className="p-5">
                                <h1 className="font-proximaNova text-3xl">Album</h1>
                                <div className="mt-2">
                                    <Link href={`/info/album/${data.album.id}`}>
                                        <a className="hover:cursor-pointer">
                                            <div className="hover:bg-[#404040] rounded-lg ease-in-out duration-100 p-2">
                                                <div className="flex flex-col items-center md:flex-row">
                                                    <div className="relative h-[128px] w-[128px] md:h-[100px] md:w-[100px]">
                                                        <Image
                                                            alt="albumArt"
                                                            draggable={false}
                                                            src={data.album.images[0].url}
                                                            layout="fill"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col text-center mt-2 md:mt-0 md:text-left md:ml-4">
                                                        <h1 className="text-2xl">{data.album.name}</h1>
                                                        <p>Released: {formatDate(data.album.release_date)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div id="artists" className="mt-8 bg-mgray rounded-md">
                            <div className="p-5">
                                <h1 className="font-proximaNova text-3xl">Artists</h1>
                                <div className="mt-2">
                                    {data.artists.map((artist: any) => (
                                        <Link href={`/info/artist/${artist.id}`} key={artist.id}>
                                            <a className="hover:cursor-pointer">
                                                <div className="hover:bg-[#404040] rounded-lg ease-in-out duration-100 p-2">
                                                    <div className="flex flex-wrap">
                                                        <div className="flex flex-col">
                                                            <h1 className="text-2xl">{artist.name}</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div id="audio-analysis" className="mt-8 bg-mgray rounded-md">
                            <div className="p-5">
                                <div>
                                    <h1 className="font-proximaNova text-3xl">Audio Analysis</h1>
                                </div>
                                <div className="mt-4 flex gap-4 flex-wrap justify-center">
                                    <div id="key" className="bg-[#303030] rounded-md">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-2xl">Key</h1>
                                            <div className="mt-2 w-[195px]">
                                                <p className="mt-1 text-xl">{pianoKey(afData.key)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="mode" className="bg-[#303030] rounded-md">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-2xl">Mode</h1>
                                            <div className="mt-2 w-[195px]">
                                                <p className="mt-1 text-xl">{afData.mode === 0 ? "Minor" : "Major"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="bpm" className="bg-[#303030] rounded-md">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-2xl">BPM</h1>
                                            <div className="mt-2 w-[195px]">
                                                <p className="mt-1 text-xl">{afData.tempo.toFixed(3)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="overall-loudness" className="bg-[#303030] rounded-md">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-2xl">Overall Loudness</h1>
                                            <div className="mt-2 w-[195px]">
                                                <p className="mt-1 text-xl">{afData.loudness.toFixed(3)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="time-signature" className="bg-[#303030] rounded-md">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-2xl">Time Signature</h1>
                                            <div className="mt-2 w-[195px]">
                                                <p className="mt-1 text-xl">{afData.time_signature}/4</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const get_track = async (ctx: any) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/tracks/${ctx.params.track}`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            access_token: getCookie("acct", { req: ctx.req, res: ctx.res }),
            refresh_token: getCookie("reft", { req: ctx.req, res: ctx.res }),
        }),
    }).then(res => res.json());
    if (res.status == 401 || res.status == 400) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    if (res.status == 201) {
        setCookie("acct", res.access_token, { req: ctx.req, res: ctx.res, maxAge: res.expires_in });
        setCookie("reft", res.refresh_token, { req: ctx.req, res: ctx.res });
    }
    return res;
};

const get_track_af = async (ctx: any) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/tracks/${ctx.params.track}/audiofeatures`;
    const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            access_token: getCookie("acct", { req: ctx.req, res: ctx.res }),
            refresh_token: getCookie("reft", { req: ctx.req, res: ctx.res }),
        }),
    }).then(res => res.json());
    if (res.status == 401 || res.status == 400) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    if (res.status == 201) {
        setCookie("acct", res.access_token, { req: ctx.req, res: ctx.res, maxAge: res.expires_in });
        setCookie("reft", res.refresh_token, { req: ctx.req, res: ctx.res });
    }
    return res;
};

export async function getServerSideProps(ctx: any) {
    const track = await get_track(ctx);
    const af = await get_track_af(ctx);
    return {
        props: {
            track,
            audioFeatures: af,
        },
    };
}

export default SongIndex;

function numberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatMilliseconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let result = "";
    if (hours > 0) {
        if (hours < 10) {
            result += hours.toString() + ":";
        } else {
            result += hours.toString().padStart(2, "0") + ":";
        }
    }
    if (hours > 0 || minutes > 0) {
        if (minutes < 10) {
            result += minutes.toString() + ":";
        } else {
            result += minutes.toString().padStart(2, "0") + ":";
        }
    }
    if (hours > 0 || minutes > 0) {
        result += seconds.toString().padStart(2, "0");
    } else {
        result += "0:" + seconds.toString().padStart(2, "0");
    }
    return result;
}

function formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function pianoKey(num: number): string {
    const pitchClasses = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    return pitchClasses[num % 12];
}
