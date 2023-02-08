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
import { getCookie, setCookie } from "cookies-next";
import { ProgressBar } from "../components/ProgressBar";
import { CountriesDropdown } from "../components/CountriesDropdown";

const Home: NextPage = (props: any) => {
    const [periodGenre, setPeriodGenre] = useState("short_term");
    const [periodAvg, setPeriodAvg] = useState("short_term");
    const [country, setCountry] = useState("US");

    const navbarBreakpoint = useMediaQuery("1440px");
    const fetcher = (url: any) =>
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                access_token: getCookie("acct"),
                refresh_token: getCookie("reft"),
            }),
        }).then(r => r.json());
    const getFetcher = (url: any) =>
        fetch(url, {
            method: "GET",
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
    const { data: afShort, error: error8 } = useSWR(
        () =>
            `${process.env.NEXT_PUBLIC_API_URL}/spotify/multi-audiofeatures?ids=` +
            ttShort.data.items.map((item: any) => item.id).join(","),
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: afMedium, error: error9 } = useSWR(
        () =>
            `${process.env.NEXT_PUBLIC_API_URL}/spotify/multi-audiofeatures?ids=` +
            ttMedium.data.items.map((item: any) => item.id).join(","),
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: afLong, error: error10 } = useSWR(
        () =>
            `${process.env.NEXT_PUBLIC_API_URL}/spotify/multi-audiofeatures?ids=` +
            ttLong.data.items.map((item: any) => item.id).join(","),
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );
    const { data: obsc, error: error11 } = useSWR(
        () => {
            const sc = get_obscurify_score(taShort.data, taLong.data);
            return `https://ktp0b5os1g.execute-api.us-east-2.amazonaws.com/dev/getObscurifyData?code=${country}&obscurifyScore=${sc.all_time}&recentObscurifyScore=${sc.recent}`;
        },
        getFetcher,
        {
            revalidateOnFocus: false,
        }
    );
    if (!taShort || !taMedium || !taLong || !ttShort || !ttMedium || !ttLong || !afShort || !afMedium || !afLong) {
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
    if (error1 || error2 || error3 || error4 || error5 || error6 || error7 || error8 || error9 || error10 || error11) {
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
    if (currently_playing.status == 201) {
        setCookie("acct", currently_playing.access_token, { maxAge: currently_playing.expires_in });
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
    const audioFeatures: TopItems = {
        short_term: afShort.data,
        medium_term: afMedium.data,
        long_term: afLong.data,
    };
    const averageStats = get_averages(topArtists, topTracks, audioFeatures);
    const topGenres = get_top_genres(topArtists);
    return (
        <>
            <Sidebar active={1} />
            <div className="navbar:ml-[280px] flex font-metropolis text-white">
                <div className="m-6 sm:m-8 flex flex-col 1.5xl:flex-row">
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
                                                                    unoptimized
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
                        <div id="average-stats" className="mt-8 bg-mgray rounded-md">
                            <div className="p-5">
                                <div className="flex items-center justify-between sm:justify-start">
                                    <h1 className="font-proximaNova text-3xl hidden sxsm:block">Average Stats</h1>
                                    <h1 className="font-proximaNova text-3xl block sxsm:hidden">Stats</h1>
                                    <div className="ml-4">
                                        <PeriodDropdown setPeriod={setPeriodAvg} />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-4 flex-wrap justify-center">
                                    <div id="artist-pop" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Artist Popularity</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <ProgressBar
                                                    progress={Math.round(averageStats[periodAvg].artist_popularity)}
                                                />
                                                <p className="mt-1 text-sm">
                                                    {(averageStats[periodAvg].artist_popularity / 10).toFixed(1)}/10
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="track-pop" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Track Popularity</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <ProgressBar
                                                    progress={Math.round(averageStats[periodAvg].track_popularity)}
                                                />
                                                <p className="mt-1 text-sm">
                                                    {(averageStats[periodAvg].track_popularity / 10).toFixed(1)}/10
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="danceability" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Danceability</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <ProgressBar progress={averageStats[periodAvg].danceability * 100} />
                                                <p className="mt-1 text-sm">
                                                    {(averageStats[periodAvg].danceability * 100).toFixed(1)}/100
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="energy" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Energy</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <ProgressBar progress={averageStats[periodAvg].energy * 100} />
                                                <p className="mt-1 text-sm">
                                                    {(averageStats[periodAvg].energy * 100).toFixed(1)}/100
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="acousticness" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Acousticness</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <ProgressBar progress={averageStats[periodAvg].acousticness * 100} />
                                                <p className="mt-1 text-sm">
                                                    {(averageStats[periodAvg].acousticness * 100).toFixed(1)}/100
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="speechiness" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Speechiness</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <ProgressBar progress={averageStats[periodAvg].speechiness * 100} />
                                                <p className="mt-1 text-sm">
                                                    {(averageStats[periodAvg].speechiness * 100).toFixed(1)}/100
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="valence" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Happiness</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <ProgressBar progress={averageStats[periodAvg].valence * 100} />
                                                <p className="mt-1 text-sm">
                                                    {(averageStats[periodAvg].valence * 100).toFixed(1)}/100
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="valence" className="bg-[#303030] rounded-md w-full sxsm:w-auto">
                                        <div className="p-5">
                                            <h1 className="font-proximaNova text-xl">Tempo</h1>
                                            <div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
                                                <p className="mt-1 text-md">
                                                    {averageStats[periodAvg].tempo.toFixed(1)} BPM
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="obscurify-stats" className="mt-8 bg-mgray rounded-md">
                            <div className="p-5">
                                <div className="flex items-center justify-between sm:justify-start">
                                    <h1 className="font-proximaNova text-3xl hidden sxsm:block">Obscurify Data</h1>
                                    <h1 className="font-proximaNova text-3xl block sxsm:hidden">Obscurify</h1>
                                    <div className="ml-4">
                                        <CountriesDropdown setCountry={setCountry} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex flex-col sm:flex-row justify-between gap-4 mlg:gap-10 mlg:mx-10">
                                        <div className="bg-[#303030] rounded-md w-full">
                                            <div className="p-5">
                                                <h1 className="font-proximaNova text-2xl">Current</h1>
                                                <div className="mt-2">
                                                    <p className="mt-1 text-xl">
                                                        {obsc &&
                                                            `${Math.floor(
                                                                obsc.percentileByCountryRecent
                                                            )}% of ${numberWithCommas(obsc.userCountByCountry)}`}
                                                    </p>
                                                    <p className="mt-1 text-sm">More Obscure</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-[#303030] rounded-md w-full">
                                            <div className="p-5">
                                                <h1 className="font-proximaNova text-2xl">All Time</h1>
                                                <div className="mt-2">
                                                    <p className="mt-1 text-xl">
                                                        {obsc &&
                                                            `${Math.floor(
                                                                obsc.percentileByCountryAllTime
                                                            )}% of ${numberWithCommas(obsc.userCountByCountry)}`}
                                                    </p>
                                                    <p className="mt-1 text-sm">More Obscure</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        <MobileTopLists topArtists={topArtists} topTracks={topTracks} />
                    </div>
                </div>
            </div>
        </>
    );
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

function get_averages(topArtists: TopItems, topTracks: TopItems, audioFeatures: TopItems) {
    const artPopShort = topArtists.short_term.items.reduce((acc: any, curr: any) => acc + curr.popularity, 0);
    const artPopMed = topArtists.medium_term.items.reduce((acc: any, curr: any) => acc + curr.popularity, 0);
    const artPopLong = topArtists.long_term.items.reduce((acc: any, curr: any) => acc + curr.popularity, 0);

    const trackPopShort = topTracks.short_term.items.reduce((acc: any, curr: any) => acc + curr.popularity, 0);
    const trackPopMed = topTracks.medium_term.items.reduce((acc: any, curr: any) => acc + curr.popularity, 0);
    const trackPopLong = topTracks.long_term.items.reduce((acc: any, curr: any) => acc + curr.popularity, 0);
    console.log(audioFeatures);

    const danceShort = audioFeatures.short_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.danceability;
        }
        return acc;
    }, 0);
    const danceMed = audioFeatures.medium_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.danceability;
        }
        return acc;
    }, 0);
    const danceLong = audioFeatures.long_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.danceability;
        }
        return acc;
    }, 0);

    const energyShort = audioFeatures.short_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.energy;
        }
        return acc;
    }, 0);
    const energyMed = audioFeatures.medium_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.energy;
        }
        return acc;
    }, 0);
    const energyLong = audioFeatures.long_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.energy;
        }
        return acc;
    }, 0);

    const acustShort = audioFeatures.short_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.acousticness;
        }
        return acc;
    }, 0);
    const acustMed = audioFeatures.medium_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.acousticness;
        }
        return acc;
    }, 0);
    const acustLong = audioFeatures.long_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.acousticness;
        }
        return acc;
    }, 0);

    const speechShort = audioFeatures.short_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.speechiness;
        }
        return acc;
    }, 0);
    const speechMed = audioFeatures.medium_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.speechiness;
        }
        return acc;
    }, 0);
    const speechLong = audioFeatures.long_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.speechiness;
        }
        return acc;
    }, 0);

    const tempoShort = audioFeatures.short_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.tempo;
        }
        return acc;
    }, 0);
    const tempoMed = audioFeatures.medium_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.tempo;
        }
        return acc;
    }, 0);
    const tempoLong = audioFeatures.long_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.tempo;
        }
        return acc;
    }, 0);

    const valenceShort = audioFeatures.short_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.valence;
        }
        return acc;
    }, 0);
    const valenceMed = audioFeatures.medium_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.valence;
        }
        return acc;
    }, 0);
    const valenceLong = audioFeatures.long_term.audio_features.reduce((acc: any, curr: any) => {
        if (curr !== null) {
            acc += curr.valence;
        }
        return acc;
    }, 0);

    const averageStats: any = {
        short_term: {
            artist_popularity: artPopShort / topArtists.short_term.items.length,
            track_popularity: trackPopShort / topTracks.short_term.items.length,
            danceability: danceShort / audioFeatures.short_term.audio_features.length,
            energy: energyShort / audioFeatures.short_term.audio_features.length,
            acousticness: acustShort / audioFeatures.short_term.audio_features.length,
            speechiness: speechShort / audioFeatures.short_term.audio_features.length,
            tempo: tempoShort / audioFeatures.short_term.audio_features.length,
            valence: valenceShort / audioFeatures.short_term.audio_features.length,
        },
        medium_term: {
            artist_popularity: artPopMed / topArtists.medium_term.items.length,
            track_popularity: trackPopMed / topTracks.medium_term.items.length,
            danceability: danceMed / audioFeatures.medium_term.audio_features.length,
            energy: energyMed / audioFeatures.medium_term.audio_features.length,
            acousticness: acustMed / audioFeatures.medium_term.audio_features.length,
            speechiness: speechMed / audioFeatures.medium_term.audio_features.length,
            tempo: tempoMed / audioFeatures.medium_term.audio_features.length,
            valence: valenceMed / audioFeatures.medium_term.audio_features.length,
        },
        long_term: {
            artist_popularity: artPopLong / topArtists.long_term.items.length,
            track_popularity: trackPopLong / topTracks.long_term.items.length,
            danceability: danceLong / audioFeatures.long_term.audio_features.length,
            energy: energyLong / audioFeatures.long_term.audio_features.length,
            acousticness: acustLong / audioFeatures.long_term.audio_features.length,
            speechiness: speechLong / audioFeatures.long_term.audio_features.length,
            tempo: tempoLong / audioFeatures.long_term.audio_features.length,
            valence: valenceLong / audioFeatures.long_term.audio_features.length,
        },
    };
    return averageStats;
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

function get_obscurify_score(short_term: any, long_term: any) {
    const obscurifyScore: any = {
        recent: 0,
        all_time: 0,
    };

    var recentTemp = 0;
    for (let i = 0; i < short_term.items.length; i++) {
        recentTemp +=
            (50 / short_term.items.length) *
            Math.floor(short_term.items[i].popularity * (1 - i / short_term.items.length));
    }
    obscurifyScore.recent = Math.floor(recentTemp / 10);

    var allTimeTemp = 0;
    for (let i = 0; i < long_term.items.length; i++) {
        allTimeTemp +=
            (50 / long_term.items.length) *
            Math.floor(long_term.items[i].popularity * (1 - i / long_term.items.length));
    }
    obscurifyScore.all_time = Math.floor(allTimeTemp / 10);
    return obscurifyScore;
}

function numberWithCommas(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
