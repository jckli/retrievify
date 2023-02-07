import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { TypeDropdown } from "../TypeDropdown";
import { PeriodDropdown } from "../PeriodDropdown";

export const MobileTopLists = (props: any) => {
    const [height, setHeight] = useState("0px");
    const [rotate, setRotate] = useState("rotate-90");
    const [topType, setTopType] = useState("artists");
    const [topPeriod, setTopPeriod] = useState("short_term");
    const expand = () => {
        height == "0px" ? setHeight("300rem") : setHeight("0px");
        rotate == "-rotate-90" ? setRotate("rotate-90") : setRotate("-rotate-90");
    };
    const type = topType == "artists" ? props.topArtists : props.topTracks;
    return (
        <div id="top-lists" className="bg-mgray rounded-md mt-8">
            <div className="p-5">
                <div className="flex flex-col xsm:items-center xsm:flex-row">
                    <div className="flex items-center">
                        <h1 className="font-proximaNova text-3xl">Top Lists</h1>
                    </div>
                    <div className="flex mt-2 xsm:ml-4 xsm:mt-0 xsm:justify-between flex-grow">
                        <div className="block">
                            <TypeDropdown setType={setTopType} />
                        </div>
                        <div className="ml-4">
                            <PeriodDropdown setPeriod={setTopPeriod} fromDirection="right" />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex flex-col">
                        {type[topPeriod]?.items.slice(0, 10).map((item: any, index: number) => (
                            <div
                                key={index}
                                className="mt-2 p-2 rounded-lg hover:bg-[#404040] ease-in-out duration-100"
                            >
                                {topType == "artists" ? (
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
                                                        <h1 className="text-xl xsm:text-2xl text-ellipsis overflow-hidden w-[140px] xxsm:w-[155px] xsm:w-auto">
                                                            {item.name}
                                                        </h1>
                                                        <h2 className="text-sm xsm:text-base">
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
                                ) : (
                                    <Link href={`/info/track/${item.id}`}>
                                        <div className="hover:cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="relative h-[64px] w-[64px]">
                                                            <Image
                                                                alt="albumArt"
                                                                unoptimized
                                                                draggable={false}
                                                                src={item.album.images[0].url}
                                                                layout="fill"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h1 className="text-xl xsm:text-2xl text-ellipsis overflow-hidden w-[140px] xxsm:w-[155px] xsm:w-auto">
                                                            {item.name}
                                                        </h1>
                                                        <h2 className="text-sm xsm:text-base">
                                                            {item.artists.map((artist: any) => artist.name).join(", ")}
                                                        </h2>
                                                    </div>
                                                </div>
                                                <a href={item.external_urls.spotify} className="ml-2">
                                                    <FontAwesomeIcon icon={faSpotify} size="lg" />
                                                </a>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div className="overflow-hidden transition-all duration-200" style={{ maxHeight: height }}>
                            {type[topPeriod]?.items.slice(10, 50).map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="mt-2 p-2 rounded-lg hover:bg-[#404040] ease-in-out duration-100"
                                >
                                    {topType == "artists" ? (
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
                                                            <h1 className="text-xl xsm:text-2xl text-ellipsis overflow-hidden w-[140px] xxsm:w-[155px] xsm:w-auto">
                                                                {item.name}
                                                            </h1>
                                                            <h2 className="text-sm xsm:text-base">
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
                                    ) : (
                                        <Link href={`/info/track/${item.id}`}>
                                            <div className="hover:cursor-pointer">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="relative h-[64px] w-[64px]">
                                                                <Image
                                                                    alt="albumArt"
                                                                    unoptimized
                                                                    draggable={false}
                                                                    src={item.album.images[0].url}
                                                                    layout="fill"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <h1 className="text-xl xsm:text-2xl text-ellipsis overflow-hidden w-[140px] xxsm:w-[155px] xsm:w-auto">
                                                                {item.name}
                                                            </h1>
                                                            <h2 className="text-sm xsm:text-base">
                                                                {item.artists
                                                                    .map((artist: any) => artist.name)
                                                                    .join(", ")}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                    <a href={item.external_urls.spotify} className="ml-2">
                                                        <FontAwesomeIcon icon={faSpotify} size="lg" />
                                                    </a>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
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
                                    className={`h-[40px] min-w-[40px] rounded-md p-[2px] hover:bg-[#303030] ease-in-out duration-200 dark:hover:bg-gray-100/5 origin-center transition-all ${rotate}`}
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
    );
};
