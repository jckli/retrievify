import type { NextPage } from "next";
import useSWR from "swr";
import Image from "next/image";
import { Sidebar } from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

const Home: NextPage = () => {
    const fetcher = (url: any) => fetch(url).then(r => r.json());
    const { data, error } = useSWR("/api/spotify/currentlyplaying", fetcher, {
        refreshInterval: 10000,
    });
    if (!data || error) {
        <div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
            Loading...
        </div>;
    }

    return (
        <>
            <Sidebar active={1} />
            <div className="ml-[280px] flex font-metropolis text-white">
                <div className="m-8">
                    <div id="now-playing" className="bg-mgray rounded-md">
                        <div className="p-5 min-w-[550px]">
                            <h1 className="font-proximaNova text-3xl">Now Playing</h1>
                            <div className="mt-4">
                                <div className="flex">
                                    <div className="relative h-[128px] min-w-[128px]">
                                        <Image
                                            alt="albumArt"
                                            draggable={false}
                                            src={data?.item.album.images[0].url}
                                            layout="fill"
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <h1 className="text-2xl">{data?.item.name}</h1>
                                        <h2>{data?.item.artists.map((artist: any) => artist.name).join(", ")}</h2>
                                        <a href={data?.item.external_urls.spotify} className="block mt-1">
                                            <FontAwesomeIcon icon={faSpotify} size="lg" />
                                        </a>
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
