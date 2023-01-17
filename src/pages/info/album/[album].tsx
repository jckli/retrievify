import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Sidebar } from "../../../components/Sidebar";

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
    return (
        <>
            <Sidebar />
        </>
    );
};

export default ArtistIndex;
