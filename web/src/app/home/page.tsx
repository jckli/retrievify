"use client";

import type { NextPage } from "next";
import useSWR from "swr";
import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { PeriodDropdown } from "@/components/PeriodDropdown";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { fetcher } from "@/utils/fetcher";
import { MobileTopLists } from "@/components/Home/MobileTopLists";
import { ProgressBar } from "@/components/ProgressBar";
import { CountriesDropdown } from "@/components/CountriesDropdown";
import { ObscureChart } from "@/components/Home/ObsChart";

const terms = ["short_term", "medium_term", "long_term"] as const;

const Home: NextPage = () => {
	const [periodGenre, setPeriodGenre] = useState<(typeof terms)[number]>("short_term");
	const [periodAvg, setPeriodAvg] = useState<(typeof terms)[number]>("short_term");
	const [country, setCountry] = useState("US");

	const { data: playing, error: errPlay } = useSWR(`/spotify/currentlyplaying`, fetcher, {
		refreshInterval: 10000,
	});

	const { data: taShort, error: e1 } = useSWR(
		`/spotify/topitems/artists?time_range=short_term&limit=50`,
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

	const { data: obsc } = useSWR(() => {
		if (isLoading) return null;
		const sc = get_obscurify_score(taShort, taLong);
		return `https://ktp0b5os1g.execute-api.us-east-2.amazonaws.com/dev/getObscurifyData?code=${country}&obscurifyScore=${sc.all_time}&recentObscurifyScore=${sc.recent}`;
	});

	if (isLoading || isError) {
		return (
			<>
				<Sidebar />
				<div className="navbar:ml-[280px] flex font-metropolis text-white">
					<div className="flex w-[100vw] h-[100vh] items-center justify-center font-proximaNova">
						{isError ? "Failed to load data. Are you logged in?" : "Loading..."}
					</div>
				</div>
			</>
		);
	}

	const topArtists = { short_term: taShort, medium_term: taMed, long_term: taLong };
	const topTracks = { short_term: ttShort, medium_term: ttMed, long_term: ttLong };
	const audioFeatures = { short_term: afShort, medium_term: afMed, long_term: afLong };

	const averageStats = get_averages(topArtists, topTracks, audioFeatures);
	const topGenres = get_top_genres(topArtists);

	return (
		<>
			<Sidebar active={1} />
			<div className="navbar:ml-[280px] flex font-metropolis text-white">
				<div className="m-6 sm:m-8 flex flex-col 1.5xl:flex-row w-full">
					<div className="1.5xl:w-[50%] flex flex-col">
						<div
							id="now-playing"
							className="bg-mgray rounded-md 1.5xl:min-w-[50%] h-fit p-5"
						>
							<h1 className="font-proximaNova text-3xl">Now Playing</h1>
							<div className="mt-4">
								{playing?.item ? (
									<Link href={`/info/track/${playing.item.id}`}>
										<div className="hover:cursor-pointer rounded-lg hover:bg-[#404040] ease-in-out duration-100 p-2 flex flex-col text-center xsm:text-left xsm:flex-row">
											<div className="m-auto xsm:mx-0 relative h-[128px] w-[128px]">
												<Image
													alt="albumArt"
													unoptimized
													draggable={
														false
													}
													src={
														playing
															.item
															.album
															.images[0]
															.url
													}
													layout="fill"
												/>
											</div>
											<div className="mt-4 xsm:mt-0 xsm:ml-4">
												<h1 className="text-2xl">
													{
														playing
															.item
															.name
													}
												</h1>
												<h2>
													{playing.item.artists
														.map(
															(
																a: any,
															) =>
																a.name,
														)
														.join(
															", ",
														)}
												</h2>
												<a
													href={
														playing
															.item
															.external_urls
															.spotify
													}
													className="block mt-1"
												>
													<FontAwesomeIcon
														icon={
															faSpotify
														}
														size="lg"
													/>
												</a>
											</div>
										</div>
									</Link>
								) : (
									<h1 className="text-2xl">Nothing Playing</h1>
								)}
							</div>
						</div>

						<div id="average-stats" className="mt-8 bg-mgray rounded-md p-5">
							<div className="flex items-center justify-between sm:justify-start">
								<h1 className="font-proximaNova text-3xl hidden sxsm:block">
									Average Stats
								</h1>
								<h1 className="font-proximaNova text-3xl block sxsm:hidden">
									Stats
								</h1>
								<div className="ml-4">
									<PeriodDropdown setPeriod={setPeriodAvg} />
								</div>
							</div>

							<div className="mt-4 flex gap-4 flex-wrap justify-center">
								{[
									{
										id: "artist-pop",
										label: "Artist Popularity",
										key: "artist_popularity",
										max: 10,
										mult: 1,
										fixed: 1,
									},
									{
										id: "track-pop",
										label: "Track Popularity",
										key: "track_popularity",
										max: 10,
										mult: 1,
										fixed: 1,
									},
									{
										id: "danceability",
										label: "Danceability",
										key: "danceability",
										max: 100,
										mult: 100,
										fixed: 1,
									},
									{
										id: "energy",
										label: "Energy",
										key: "energy",
										max: 100,
										mult: 100,
										fixed: 1,
									},
									{
										id: "acousticness",
										label: "Acousticness",
										key: "acousticness",
										max: 100,
										mult: 100,
										fixed: 1,
									},
									{
										id: "speechiness",
										label: "Speechiness",
										key: "speechiness",
										max: 100,
										mult: 100,
										fixed: 1,
									},
								].map(stat => {
									const val =
										averageStats[periodAvg][stat.key] *
										stat.mult;
									return (
										<div
											key={stat.id}
											id={stat.id}
											className="bg-[#303030] rounded-md w-full sxsm:w-auto p-5"
										>
											<h1 className="font-proximaNova text-xl">
												{stat.label}
											</h1>
											<div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
												<ProgressBar
													progress={Math.round(
														val,
													)}
												/>
												<p className="mt-1 text-sm">
													{(
														val /
														stat.max
													).toFixed(
														stat.fixed,
													)}
													/{stat.max}
												</p>
											</div>
										</div>
									);
								})}

								<div
									id="tempo"
									className="bg-[#303030] rounded-md w-full sxsm:w-auto p-5"
								>
									<h1 className="font-proximaNova text-xl">
										Tempo
									</h1>
									<div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
										<p className="mt-1 text-md">
											{averageStats[
												periodAvg
											].tempo.toFixed(1)}{" "}
											BPM
										</p>
									</div>
								</div>
							</div>
						</div>

						<div id="obscurify-stats" className="mt-8 bg-mgray rounded-md p-5">
							<div className="flex items-center justify-between sm:justify-start">
								<h1 className="font-proximaNova text-3xl hidden sxsm:block">
									Obscurify Data
								</h1>
								<h1 className="font-proximaNova text-3xl block sxsm:hidden">
									Obscurify
								</h1>
								<div className="ml-4">
									<CountriesDropdown setCountry={setCountry} />
								</div>
							</div>
							<div className="mt-4 flex flex-col sm:flex-row justify-between gap-4 mlg:gap-10 mlg:mx-10">
								{["Recent", "All Time"].map((label, i) => {
									const isRecent = i === 0;
									const percent = obsc
										? isRecent
											? obsc.percentileByCountryRecent
											: obsc.percentileByCountryAllTime
										: 0;
									return (
										<div
											key={label}
											className="bg-[#303030] rounded-md w-full p-5"
										>
											<h1 className="font-proximaNova text-2xl">
												{label}
											</h1>
											<div className="mt-2">
												<p className="mt-1 text-xl">
													{obsc &&
														`${Math.floor(percent)}% of ${numberWithCommas(obsc.userCountByCountry)}`}
												</p>
												<p className="mt-1 text-sm">
													More Obscure
												</p>
											</div>
										</div>
									);
								})}
							</div>
							<div className="mt-4 flex flex-col items-center">
								<h1 className="font-proximaNova text-2xl">
									Country Distribution Graph
								</h1>
								{obsc && <ObscureChart data={obsc} />}
							</div>
						</div>
					</div>

					<div className="1.5xl:w-[50%] flex flex-col 1.5xl:ml-8">
						{/* TOP GENRES MODULE */}
						<div
							id="top-genres"
							className="bg-mgray rounded-md mt-8 1.5xl:mt-0 p-5"
						>
							<div className="flex items-center justify-between sm:justify-start">
								<h1 className="font-proximaNova text-3xl">
									Top Genres
								</h1>
								<div className="ml-4">
									<PeriodDropdown setPeriod={setPeriodGenre} />
								</div>
							</div>
							<div className="mt-4 flex flex-wrap gap-4">
								{topGenres[periodGenre]
									.slice(0, 10)
									.map((genre: string, idx: number) => (
										<div
											key={idx}
											className="bg-[#404040] rounded-lg"
										>
											<h1 className="text-2xl m-2 mx-3">
												{idx + 1}. {genre}
											</h1>
										</div>
									))}
							</div>
						</div>
						<MobileTopLists topArtists={topArtists} topTracks={topTracks} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Home;

function get_averages(topArtists: any, topTracks: any, audioFeatures: any) {
	const stats: any = {};

	terms.forEach(term => {
		const artists = topArtists[term]?.items || [];
		const tracks = topTracks[term]?.items || [];
		const afs = (audioFeatures[term]?.audio_features || []).filter(Boolean); // Remove nulls

		const avg = (arr: any[], key: string) =>
			arr.length ? arr.reduce((sum, obj) => sum + (obj[key] || 0), 0) / arr.length : 0;

		stats[term] = {
			artist_popularity: avg(artists, "popularity"),
			track_popularity: avg(tracks, "popularity"),
			danceability: avg(afs, "danceability"),
			energy: avg(afs, "energy"),
			acousticness: avg(afs, "acousticness"),
			speechiness: avg(afs, "speechiness"),
			tempo: avg(afs, "tempo"),
			valence: avg(afs, "valence"),
		};
	});
	return stats;
}

function get_top_genres(topArtists: any) {
	const topGenres: any = {};
	terms.forEach(term => {
		const counts: Record<string, number> = {};
		topArtists[term]?.items?.forEach((a: any) => {
			a.genres?.forEach((g: string) => (counts[g] = (counts[g] || 0) + 1));
		});
		topGenres[term] = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
	});
	return topGenres;
}

function get_obscurify_score(short_term: any, long_term: any) {
	const calcObs = (items: any[]) =>
		Math.floor(
			items.reduce(
				(sum, item, i) =>
					sum +
					(50 / items.length) * Math.floor(item.popularity * (1 - i / items.length)),
				0,
			) / 10,
		);

	return {
		recent: calcObs(short_term?.items || []),
		all_time: calcObs(long_term?.items || []),
	};
}

function numberWithCommas(num: number) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
