import type { NextPage } from "next";
import { useRouter } from "next/router";

const SongIndex: NextPage = () => {
    const router = useRouter();
    const { artistId, songId } = router.query;
    return <></>;
};

export default SongIndex;
