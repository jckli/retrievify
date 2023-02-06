import type { NextPage } from "next";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { PeriodDropdown } from "../components/PeriodDropdown";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MobileTopLists } from "../components/Home/MobileTopLists";
import { TopArtists } from "../components/Home/TopArtists";
import { getCookie, setCookie } from "cookies-next";
import { TopTracks } from "../components/Home/TopTracks";

const Home: NextPage = (props: any) => {
    const [periodGenre, setPeriodGenre] = useState("short_term");

    const navbarBreakpoint = useMediaQuery("1440px");
    const fetcher = (url: any) =>
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                access_token: getCookie("acct"),
                refresh_token: getCookie("reft"),
            }),
        }).then(r => r.json());

    const { data: currently_playing, error: error1 } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/currentlyplaying`,
        fetcher,
        {
            fallbackData: props.currently_playing,
            refreshInterval: 10000,
        }
    );
    const { data: taShort, error: error2 } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/topitems/artists?time_range=short_term&limit=50`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: taMedium, error: error3 } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/topitems/artists?time_range=medium_term&limit=50`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: taLong, error: error4 } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/topitems/artists?time_range=long_term&limit=50`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: ttShort, error: error5 } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/topitems/tracks?time_range=short_term&limit=50`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: ttMedium, error: error6 } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/topitems/tracks?time_range=medium_term&limit=50`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: ttLong, error: error7 } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/topitems/tracks?time_range=long_term&limit=50`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    if (!taShort || !taMedium || !taLong || !ttShort || !ttMedium || !ttLong) {
        return (
            <>
                <Sidebar />
                <div className="navbar:ml-[280px] flex font-metropolis text-white">
                    <div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
                        Loading...
                    </div>
                </div>
            </>
        );
    }
    if (error1 || error2 || error3 || error4 || error5 || error6 || error7) {
        return (
            <>
                <Sidebar />
                <div className="navbar:ml-[280px] flex font-metropolis text-white">
                    <div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
                        Failed to load data.
                    </div>
                </div>
            </>
        );
    }
    const topArtists: TopItems = {
        short_term: taShort.data,
        medium_term: taMedium.data,
        long_term: taLong.data,
    };
    const topTracks: TopItems = {
        short_term: ttShort.data,
        medium_term: ttMedium.data,
        long_term: ttLong.data,
    };
    const topGenres = get_top_genres(topArtists);
    return (
        <>
            <Sidebar active={1} />
            <div className="navbar:ml-[280px] flex font-metropolis text-white">
                <div className="m-8 flex flex-col 1.5xl:flex-row">
                    <div className="1.5xl:w-[50%] flex flex-col">
                        <div id="now-playing" className="bg-mgray rounded-md 1.5xl:min-w-[50%] h-fit">
                            <div className="p-5">
                                <h1 className="font-proximaNova text-3xl">Now Playing</h1>
                                <div className="mt-4">
                                    {currently_playing.status != 404 ? (
                                        <Link href={`/info/track/${currently_playing.data.item.id}`}>
                                            <div className="hover:cursor-pointer">
                                                <div className="rounded-lg hover:bg-[#404040] ease-in-out duration-100 p-2">
                                                    <div className="flex flex-col text-center xsm:text-left xsm:flex-row">
                                                        <div className="m-auto xsm:mx-0">
                                                            <div className="relative h-[128px] w-[128px]">
                                                                <Image
                                                                    alt="albumArt"
                                                                    draggable={false}
                                                                    src={
                                                                        currently_playing.data.item.album.images[0].url
                                                                    }
                                                                    layout="fill"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 xsm:mt-0 xsm:ml-4">
                                                            <h1 className="text-2xl">
                                                                {currently_playing.data.item.name}
                                                            </h1>
                                                            <h2>
                                                                {currently_playing.data.item.artists
                                                                    .map((artist: any) => artist.name)
                                                                    .join(", ")}
                                                            </h2>
                                                            <a
                                                                href={currently_playing.data.item.external_urls.spotify}
                                                                className="block mt-1"
                                                            >
                                                                <FontAwesomeIcon icon={faSpotify} size="lg" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col">
                                            <h1 className="text-2xl">Nothing Playing</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {navbarBreakpoint && <TopArtists topArtists={topArtists} />}
                    </div>
                    <div className="1.5xl:w-[50%] flex flex-col 1.5xl:ml-8">
                        <div id="top-genres" className="bg-mgray rounded-md mt-8 1.5xl:mt-0">
                            <div className="p-5">
                                <div className="flex items-center justify-between sm:justify-start">
                                    <h1 className="font-proximaNova text-3xl">Top Genres</h1>
                                    <div className="ml-4">
                                        <PeriodDropdown setPeriod={setPeriodGenre} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex flex-wrap gap-4">
                                        {topGenres[periodGenre].slice(0, 10).map((genre: string, index: number) => (
                                            <div key={index + 1} className="bg-[#404040] rounded-lg">
                                                <h1 className="text-2xl m-2 mx-3">
                                                    {index + 1}. {genre}
                                                </h1>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {navbarBreakpoint && <TopTracks topTracks={topTracks} />}
                        {!navbarBreakpoint && <MobileTopLists topArtists={topArtists} topTracks={topTracks} />}
                    </div>
                </div>
            </div>
        </>
    );
};

const get_top = async (ctx: any, time_range: any, type: any) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/topitems/${type}?time_range=${time_range}&limit=50`;
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

const get_cur_playing = async (ctx: any) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/currentlyplaying`;
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
    const curPlaying = await get_cur_playing(ctx);
    return {
        props: {
            curPlaying,
        },
    };
}

export default Home;

interface TopItems {
    [key: string]: any;
    short_term: any;
    medium_term: any;
    long_term: any;
}

function get_top_genres(topArtists: TopItems) {
    const topGenres: any = {
        short_term: [],
        medium_term: [],
        long_term: [],
    };
    const short_term_temp: any = [];
    topArtists.short_term?.items.forEach((artist: any) => {
        artist.genres.forEach((genre: any) => {
            short_term_temp.push(genre);
        });
    });
    var stcnts = short_term_temp.reduce(function (obj: any, v: any) {
        obj[v] = (obj[v] || 0) + 1;
        return obj;
    }, {});
    topGenres.short_term = Object.keys(stcnts).sort(function (a, b) {
        return stcnts[b] - stcnts[a];
    });

    const medium_term_temp: any = [];
    topArtists.medium_term?.items.forEach((artist: any) => {
        artist.genres.forEach((genre: any) => {
            medium_term_temp.push(genre);
        });
    });
    var mtcnts = medium_term_temp.reduce(function (obj: any, v: any) {
        obj[v] = (obj[v] || 0) + 1;
        return obj;
    }, {});
    topGenres.medium_term = Object.keys(mtcnts).sort(function (a, b) {
        return mtcnts[b] - mtcnts[a];
    });

    const long_term_temp: any = [];
    topArtists.long_term?.items.forEach((artist: any) => {
        artist.genres.forEach((genre: any) => {
            long_term_temp.push(genre);
        });
    });
    var ltcnts = long_term_temp.reduce(function (obj: any, v: any) {
        obj[v] = (obj[v] || 0) + 1;
        return obj;
    }, {});
    topGenres.long_term = Object.keys(ltcnts).sort(function (a, b) {
        return ltcnts[b] - ltcnts[a];
    });

    return topGenres;
}
