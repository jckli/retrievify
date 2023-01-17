import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";
import useSWR from "swr";
import Image from "next/image";

const ArtistIndex: NextPage = () => {
    const router = useRouter();
    const { artist } = router.query;
    const [albumId, setAlbumId] = useState(artist);
    const fetcher = (url: any) => fetch(url).then(r => r.json());
    useEffect(() => {
        if (!router.isReady) return;
        const { album } = router.query;
        setAlbumId(album);
    }, [router.isReady, router.query]);

    const { data, error } = useSWR(albumId ? `/api/spotify/albums/${albumId}` : null, albumId ? fetcher : null, {
        revalidateOnFocus: false,
    });

    if (error) {
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
    if (!data) {
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ArtistIndex;
