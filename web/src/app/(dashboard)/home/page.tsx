"use client";

import type { NextPage } from "next";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

import { NowPlaying } from "@/components/Home/NowPlaying";
import { AverageStats } from "@/components/Home/AverageStats";
import { ObscurifyStats } from "@/components/Home/ObscurifyStats";
import { TopGenres } from "@/components/Home/TopGenres";
import { MobileTopLists } from "@/components/Home/MobileTopLists";

const Home: NextPage = () => {
	const { data: playing, error: errPlay } = useSWR(`/retrievify/spotify/currentlyplaying`, fetcher, {
		refreshInterval: 10000,
	});
	const { data: taShort, error: e1 } = useSWR(
		`/retrievify/spotify/topitems/artists?time_range=short_term&limit=50`,
		fetcher,
	);
	const { data: taMed, error: e2 } = useSWR(
		`/retrievify/spotify/topitems/artists?time_range=medium_term&limit=50`,
		fetcher,
	);
	const { data: taLong, error: e3 } = useSWR(
		`/retrievify/spotify/topitems/artists?time_range=long_term&limit=50`,
		fetcher,
	);
	const { data: ttShort, error: e4 } = useSWR(
		`/retrievify/spotify/topitems/tracks?time_range=short_term&limit=50`,
		fetcher,
	);
	const { data: ttMed, error: e5 } = useSWR(
		`/retrievify/spotify/topitems/tracks?time_range=medium_term&limit=50`,
		fetcher,
	);
	const { data: ttLong, error: e6 } = useSWR(
		`/retrievify/spotify/topitems/tracks?time_range=long_term&limit=50`,
		fetcher,
	);

	const { data: afShort, error: e7 } = useSWR(
		() =>
			ttShort
				? `/retrievify/spotify/multi-audiofeatures?ids=${ttShort.items.map((i: any) => i.id).join(",")}`
				: null,
		fetcher,
	);
	const { data: afMed, error: e8 } = useSWR(
		() =>
			ttMed
				? `/retrievify/spotify/multi-audiofeatures?ids=${ttMed.items.map((i: any) => i.id).join(",")}`
				: null,
		fetcher,
	);
	const { data: afLong, error: e9 } = useSWR(
		() =>
			ttLong
				? `/retrievify/spotify/multi-audiofeatures?ids=${ttLong.items.map((i: any) => i.id).join(",")}`
				: null,
		fetcher,
	);

	const isError = errPlay || e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8 || e9;
	const isLoading =
		!taShort || !taMed || !taLong || !ttShort || !ttMed || !ttLong || !afShort || !afMed || !afLong;

	if (isLoading || isError) {
		return (
			<>
				<h1 className="font-proximaNova text-2xl flex items-center justify-center">
					{isError ? "Failed to load data. Are you logged in?" : "Loading..."}
				</h1>
			</>
		);
	}

	const topArtists = { short_term: taShort, medium_term: taMed, long_term: taLong };
	const topTracks = { short_term: ttShort, medium_term: ttMed, long_term: ttLong };
	const audioFeatures = { short_term: afShort, medium_term: afMed, long_term: afLong };

	return (
		<>
			<div className="p-6 sm:p-8 grid grid-cols-1 xxl:grid-cols-2 gap-8 w-full">
				<div className="flex flex-col gap-8">
					<NowPlaying playing={playing} />
					<AverageStats
						topArtists={topArtists}
						topTracks={topTracks}
						audioFeatures={audioFeatures}
					/>
					<ObscurifyStats taShort={taShort} taLong={taLong} />
				</div>
				<div className="flex flex-col gap-8">
					<TopGenres topArtists={topArtists} />
					<MobileTopLists topArtists={topArtists} topTracks={topTracks} />
				</div>
			</div>
		</>
	);
};

export default Home;
