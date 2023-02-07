import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import useSWR from "swr";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next";

const ArtistIndex: NextPage = (props: any) => {
    const router = useRouter();
    const { artist } = router.query;
    const [albumId, setAlbumId] = useState(artist);
    useEffect(() => {
        if (!router.isReady) return;
        const { album } = router.query;
        setAlbumId(album);
    }, [router.isReady, router.query]);

    const data = props.album.data;

    if (!data) {
        return (
            <>
                <Sidebar />
                <div className="navbar:ml-[280px] flex font-metropolis text-white">
                    <div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
                        Failed to load album data.
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
                                                    src={data.images[0].url}
                                                    layout="fill"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <h1 className="text-4xl">{data.name}</h1>
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
                                    <h1 className="font-proximaNova text-3xl">Release Date</h1>
                                    <div className="mt-4">
                                        <h1 className="text-2xl">{formatDate(data.release_date)}</h1>
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
                        <div id="total-tracks" className="mt-8 1.5xl:mt-0 bg-mgray rounded-md">
                            <div className="p-5">
                                <h1 className="font-proximaNova text-3xl">Total Tracks</h1>
                                <div className="mt-4">
                                    <h1 className="text-2xl">{data.total_tracks}</h1>
                                </div>
                            </div>
                        </div>
                        <div id="tracks" className="mt-8 bg-mgray rounded-md">
                            <div className="p-5">
                                <h1 className="font-proximaNova text-3xl">Tracks</h1>
                                <div className="mt-4">
                                    <div className="flex flex-col">
                                        {data.tracks.items.map((track: any) => (
                                            <Link href={`/info/track/${track.id}`} key={track.id}>
                                                <a className="hover:cursor-pointer">
                                                    <div
                                                        key={track.id}
                                                        className="p-2 flex items-center justify-between rounded-md hover:bg-[#404040] ease-in-out duration-100"
                                                    >
                                                        <div className="flex items-center">
                                                            <div>
                                                                <h1 className="text-2xl">{track.name}</h1>
                                                                <p className="text-sm">
                                                                    {track.artists
                                                                        .map((artist: any) => artist.name)
                                                                        .join(", ")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <p>{formatMilliseconds(track.duration_ms)}</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </Link>
                                        ))}
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

const get_album = async (ctx: any) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/albums/${ctx.params.album}`;
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
    }
    return res;
};

export async function getServerSideProps(ctx: any) {
    const album = await get_album(ctx);
    console.log(album);
    return {
        props: {
            album,
        },
    };
}

export default ArtistIndex;

function formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
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
