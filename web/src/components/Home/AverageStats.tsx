import { useState, useMemo } from "react";
import { Dropdown } from "@/components/Dropdown";
import { ProgressBar } from "@/components/ProgressBar";

const terms = ["short_term", "medium_term", "long_term"] as const;
const periodOptions = [
	{ id: "short_term", value: "short_term", label: "Last 4 Weeks" },
	{ id: "medium_term", value: "medium_term", label: "Last 6 Months" },
	{ id: "long_term", value: "long_term", label: "All Time" },
];

const statConfigs = [
	{ id: "artist-pop", label: "Artist Popularity", key: "artist_popularity", max: 10, mult: 1, fixed: 1 },
	{ id: "track-pop", label: "Track Popularity", key: "track_popularity", max: 10, mult: 1, fixed: 1 },
	{ id: "danceability", label: "Danceability", key: "danceability", max: 100, mult: 100, fixed: 1 },
	{ id: "energy", label: "Energy", key: "energy", max: 100, mult: 100, fixed: 1 },
	{ id: "acousticness", label: "Acousticness", key: "acousticness", max: 100, mult: 100, fixed: 1 },
	{ id: "speechiness", label: "Speechiness", key: "speechiness", max: 100, mult: 100, fixed: 1 },
];

export const AverageStats = ({ topArtists, topTracks, audioFeatures }: any) => {
	const [period, setPeriod] = useState("short_term");

	const stats = useMemo(() => {
		const computed: any = {};
		terms.forEach(term => {
			const artists = topArtists[term]?.items || [];
			const tracks = topTracks[term]?.items || [];
			const afs = (audioFeatures[term]?.audio_features || []).filter(Boolean);
			const avg = (arr: any[], key: string) =>
				arr.length ? arr.reduce((sum, obj) => sum + (obj[key] || 0), 0) / arr.length : 0;

			computed[term] = {
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
		return computed;
	}, [topArtists, topTracks, audioFeatures]);

	const activeStats = stats[period];

	return (
		<div className="bg-mgray rounded-md p-5">
			<div className="flex items-center justify-between sm:justify-start gap-4">
				<h1 className="font-proximaNova text-3xl">Average Stats</h1>
				<Dropdown
					items={periodOptions}
					initialActiveId={period}
					onChange={setPeriod}
					align="responsive"
				/>
			</div>
			<div className="mt-4 flex gap-4 flex-wrap justify-center">
				{statConfigs.map(stat => {
					const val = activeStats[stat.key] * stat.mult;
					return (
						<div
							key={stat.id}
							className="bg-[#303030] rounded-md w-full sxsm:w-auto p-5"
						>
							<h1 className="font-proximaNova text-xl">{stat.label}</h1>
							<div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
								<ProgressBar progress={Math.round(val)} />
								<p className="mt-1 text-sm text-right">
									{(val / stat.max).toFixed(stat.fixed)}/
									{stat.max}
								</p>
							</div>
						</div>
					);
				})}
				<div className="bg-[#303030] rounded-md w-full sxsm:w-auto p-5">
					<h1 className="font-proximaNova text-xl">Tempo</h1>
					<div className="mt-2 w-full sxsm:w-[160px] sm:w-[265px]">
						<p className="mt-1 text-md">{activeStats.tempo.toFixed(1)} BPM</p>
					</div>
				</div>
			</div>
		</div>
	);
};
