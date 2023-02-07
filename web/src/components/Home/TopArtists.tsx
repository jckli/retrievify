import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { PeriodDropdown } from "../PeriodDropdown";

export const TopArtists = (props: any) => {
    const [height, setHeight] = useState("0px");
    const [rotate, setRotate] = useState("rotate-90");
    const [periodArtist, setPeriodArtist] = useState("short_term");
    const expand = () => {
        height == "0px" ? setHeight("300rem") : setHeight("0px");
        rotate == "-rotate-90" ? setRotate("rotate-90") : setRotate("-rotate-90");
    };
    return (
        <>
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
                            {props.topArtists[periodArtist]?.items.slice(0, 10).map((artist: any, index: number) => (
                                <div
                                    key={index}
                                    className="mt-2 p-2 rounded-lg hover:bg-[#404040] ease-in-out duration-100"
                                >
                                    <Link href={`/info/artist/${artist.id}`}>
                                        <div className="hover:cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="relative h-[64px] w-[64px]">
                                                            <Image
                                                                alt="albumArt"
                                                                unoptimized
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
                                                <a href={artist.external_urls.spotify} className="ml-2">
                                                    <FontAwesomeIcon icon={faSpotify} size="lg" />
                                                </a>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                            <div className="overflow-hidden transition-all duration-200" style={{ maxHeight: height }}>
                                {props.topArtists[periodArtist]?.items.slice(10, 50).map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        className="mt-2 p-2 rounded-lg hover:bg-[#404040] ease-in-out duration-100"
                                    >
                                        <Link href={`/info/artist/${item.id}`}>
                                            <div className="hover:cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="relative h-[64px] w-[64px]">
                                                                <Image
                                                                    alt="albumArt"
                                                                    unoptimized
                                                                    draggable={false}
                                                                    src={item.images[0].url}
                                                                    layout="fill"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h1 className="text-2xl">{item.name}</h1>
                                                            <h2>
                                                                {item.genres.length > 0 ? item.genres[0] : "No Genre"}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <a href={item.external_urls.spotify} className="ml-2">
                                                        <FontAwesomeIcon icon={faSpotify} size="lg" />
                                                    </a>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        expand();
                                    }}
                                >
                                    <svg
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        height="1em"
                                        className={`h-[40px] min-w-[40px] rounded-full p-[4px] hover:bg-[#303030] ease-in-out duration-200 dark:hover:bg-gray-100/5 origin-center transition-all ${rotate}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
