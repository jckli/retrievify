import type { NextPage } from "next";
import useSWR from "swr";
import Image from "next/image";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { PeriodDropdown } from "../components/PeriodDropdown";
import { useMediaQuery } from "../hooks/useMediaQuery";

const Home: NextPage = () => {
    const [periodGenre, setPeriodGenre] = useState("short_term");
    const [periodArtist, setPeriodArtist] = useState("short_term");
    const [periodTrack, setPeriodTrack] = useState("short_term");
    const navbarBreakpoint = useMediaQuery("1440px");
    const fetcher = (url: any) => fetch(url).then(r => r.json());

    // Fetch currently playing data
    const { data: currently_playing, error: error1 } = useSWR("/api/spotify/currentlyplaying", fetcher, {
        refreshInterval: 10000,
    });
    const { data: taShort, error: error2 } = useSWR(
        "/api/spotify/topitems/artists?time_range=short_term&limit=50",
        fetcher,
        { revalidateOnFocus: false }
    );
    const { data: taMedium, error: error3 } = useSWR(
        "/api/spotify/topitems/artists?time_range=medium_term&limit=50",
        fetcher,
        { revalidateOnFocus: false }
    );
    const { data: taLong, error: error4 } = useSWR(
        "/api/spotify/topitems/artists?time_range=long_term&limit=50",
        fetcher,
        { revalidateOnFocus: false }
    );
    const { data: tsShort, error: error5 } = useSWR(
        "/api/spotify/topitems/tracks?time_range=short_term&limit=50",
        fetcher,
        { revalidateOnFocus: false }
    );
    const { data: tsMedium, error: error6 } = useSWR(
        "/api/spotify/topitems/tracks?time_range=medium_term&limit=50",
        fetcher,
        { revalidateOnFocus: false }
    );
    const { data: tsLong, error: error7 } = useSWR(
        "/api/spotify/topitems/tracks?time_range=long_term&limit=50",
        fetcher,
        { revalidateOnFocus: false }
    );
    const topArtists: TopItems = {
        short_term: taShort,
        medium_term: taMedium,
        long_term: taLong,
    };
    const topTracks: TopItems = {
        short_term: tsShort,
        medium_term: tsMedium,
        long_term: tsLong,
    };
    const topGenres = get_top_genres(topArtists);

    if (error2 || error3 || error4 || error5 || error6 || error7) {
        return (
            <div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
                Loading...
            </div>
        );
    }
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
                                    {currently_playing ? (
                                        <div className="flex flex-col text-center xsm:text-left xsm:flex-row">
                                            <div className="m-auto xsm:mx-0">
                                                <div className="relative h-[128px] w-[128px]">
                                                    <Image
                                                        alt="albumArt"
                                                        draggable={false}
                                                        src={currently_playing?.item.album.images[0].url}
                                                        layout="fill"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4 xsm:mt-0 xsm:ml-4">
                                                <h1 className="text-2xl">{currently_playing?.item.name}</h1>
                                                <h2>
                                                    {currently_playing?.item.artists
                                                        .map((artist: any) => artist.name)
                                                        .join(", ")}
                                                </h2>
                                                <a
                                                    href={currently_playing?.item.external_urls.spotify}
                                                    className="block mt-1"
                                                >
                                                    <FontAwesomeIcon icon={faSpotify} size="lg" />
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            <h1 className="text-2xl">Nothing Playing</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div id="top-artists" className="bg-mgray rounded-md mt-8">
                            <div className="p-5">
                                <div className="flex items-center justify-between sm:justify-start">
                                    <h1 className="font-proximaNova text-3xl">Top Artists</h1>
                                    <div className="ml-4">
                                        <PeriodDropdown setPeriod={setPeriodArtist} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex flex-col">
                                        {topArtists[periodArtist]?.items
                                            .slice(0, 10)
                                            .map((artist: any, index: number) => (
                                                <div key={index} className="flex items-center mt-4">
                                                    <div>
                                                        <div className="relative h-[64px] w-[64px]">
                                                            <Image
                                                                alt="albumArt"
                                                                draggable={false}
                                                                src={artist.images[0].url}
                                                                layout="fill"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h1 className="text-2xl">{artist.name}</h1>
                                                        <h2>
                                                            {artist.genres.length > 0 ? artist.genres[0] : "No Genre"}
                                                        </h2>
                                                    </div>
                                                </div>
                                            ))}
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
                        <div id="top-tracks" className="bg-mgray rounded-md mt-8">
                            <div className="p-5">
                                <div className="flex items-center justify-between sm:justify-start">
                                    <h1 className="font-proximaNova text-3xl">Top Tracks</h1>
                                    <div className="ml-4">
                                        <PeriodDropdown setPeriod={setPeriodTrack} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex flex-col">
                                        {topTracks[periodTrack]?.items.slice(0, 10).map((track: any, index: number) => (
                                            <div key={index} className="flex items-center mt-4">
                                                <div>
                                                    <div className="relative h-[64px] w-[64px]">
                                                        <Image
                                                            alt="albumArt"
                                                            draggable={false}
                                                            src={track.album.images[0].url}
                                                            layout="fill"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <h1 className="text-2xl">{track.name}</h1>
                                                    <h2>
                                                        {track.artists.map((artist: any) => artist.name).join(", ")}
                                                    </h2>
                                                </div>
                                            </div>
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
