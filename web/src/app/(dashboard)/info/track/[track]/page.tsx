"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faChartBar, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "@/components/ProgressBar";
import { fetcher } from "@/utils/fetcher";

export default function TrackIndex() {
	const params = useParams();
	const trackId = params.track;

	const { data: track, error: e1 } = useSWR(trackId ? `/retrievify/spotify/tracks/${trackId}` : null, fetcher);
	const { data: af, error: e2 } = useSWR(
		trackId ? `/retrievify/spotify/tracks/${trackId}/audiofeatures` : null,
		fetcher,
	);
	const { data: statData } = useSWR(
		trackId ? `/retrievify/spotify/scrobbler/item/tracks/${trackId}` : null,
		fetcher,
	);
	const myStats = statData?.data;

	if (!track || !af || e1 || e2) {
		return (
			<div className="flex items-center justify-center font-proximaNova min-h-[70vh]">
				{e1 || e2 ? "Failed to load track data." : "Loading..."}
			</div>
		);
	}

	const featureBars = [
		{ label: "Acoustic", val: af.acousticness * 100 },
		{ label: "Danceable", val: af.danceability * 100 },
		{ label: "Energetic", val: af.energy * 100 },
		{ label: "Instrumental", val: af.instrumentalness * 100 },
		{ label: "Lively", val: af.liveness * 100 },
		{ label: "Speechful", val: af.speechiness * 100 },
		{ label: "Valence", val: af.valence * 100 },
	];

	return (
		<div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full animate-in fade-in">
			<div className="lg:col-span-4 xxl:col-span-3 flex flex-col gap-8">
				<div className="bg-mgray rounded-md p-5 flex flex-col items-center text-center">
					<div className="relative h-[256px] w-[256px]">
						<Image
							alt="trackArt"
							src={track?.album?.images?.[0]?.url}
							layout="fill"
							unoptimized
							draggable={false}
							className="rounded-md"
						/>
					</div>
					<h1 className="text-4xl mt-4 font-metropolis font-bold">{track?.name}</h1>
					<p className="text-gray-400 text-lg mt-1">
						{track?.artists?.map((a: any) => a.name).join(", ")}
					</p>
				</div>

				<div className="flex flex-col gap-4">
					<a
						href={track?.external_urls?.spotify}
						target="_blank"
						rel="noreferrer"
						className="bg-mgray p-5 rounded-md flex items-center justify-center hover:bg-[#404040] transition cursor-pointer"
					>
						<FontAwesomeIcon icon={faSpotify} size="2x" />
						<h1 className="ml-2 font-bold font-metropolis">Open on Spotify</h1>
					</a>

					<div className="bg-mgray p-5 rounded-md flex justify-between">
						<div>
							<h1 className="font-proximaNova text-2xl text-gray-400">
								Duration
							</h1>
							<h1 className="text-xl mt-1 font-bold">
								{formatMilliseconds(track?.duration_ms)}
							</h1>
						</div>
						<div className="text-right">
							<h1 className="font-proximaNova text-2xl text-gray-400">
								Popularity
							</h1>
							<h1 className="text-xl mt-1 font-bold">
								{track?.popularity / 10} / 10
							</h1>
						</div>
					</div>

					<div className="bg-mgray p-5 rounded-md">
						<h1 className="font-proximaNova text-3xl mb-4">Album</h1>
						<Link href={`/info/album/${track?.album?.id}`}>
							<div className="flex items-center gap-4 hover:bg-[#404040] p-2 rounded-lg transition cursor-pointer">
								<div className="relative h-16 w-16">
									<Image
										alt="albumArt"
										src={track?.album?.images?.[0]?.url}
										layout="fill"
										unoptimized
										className="rounded-md"
									/>
								</div>
								<div>
									<h1 className="text-xl font-bold font-metropolis">
										{track?.album?.name}
									</h1>
									<p className="text-sm text-gray-400">
										{new Date(
											track?.album?.release_date,
										).getFullYear()}
									</p>
								</div>
							</div>
						</Link>
					</div>

					{myStats && (
						<div className="bg-mgray border border-[var(--color-primary)]/40 rounded-md p-5 relative overflow-hidden">
							<div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
							<h1 className="font-proximaNova text-2xl mb-4 text-white flex items-center">
								<FontAwesomeIcon
									icon={faChartBar}
									className="text-[var(--color-primary)] mr-2"
								/>{" "}
								Your Stats
							</h1>
							<div className="flex flex-col gap-3 relative z-10">
								<div className="bg-[#303030] p-4 rounded-md flex justify-between items-center">
									<span className="text-gray-400 font-proximaNova text-lg tracking-wider">
										Total Plays
									</span>
									<span className="text-2xl font-bold font-metropolis">
										{myStats.play_count}
									</span>
								</div>
								<div className="bg-[#303030] p-4 rounded-md flex justify-between items-center">
									<span className="text-gray-400 font-proximaNova text-lg tracking-wider flex items-center">
										<FontAwesomeIcon
											icon={faClock}
											className="mr-2 text-sm"
										/>{" "}
										Minutes
									</span>
									<span className="text-xl font-bold font-metropolis">
										{Math.round(
											myStats.total_duration_ms /
												60000,
										)}
									</span>
								</div>
								<div className="bg-[#303030] p-4 rounded-md flex justify-between items-center">
									<span className="text-gray-400 font-proximaNova text-lg tracking-wider flex items-center">
										<FontAwesomeIcon
											icon={faCalendar}
											className="mr-2 text-sm"
										/>{" "}
										Latest
									</span>
									<span className="text-sm font-bold">
										{new Date(
											myStats.last_played_at,
										).toLocaleDateString()}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="lg:col-span-8 xxl:col-span-9 flex flex-col gap-8">
				<div className="bg-mgray rounded-md p-5">
					<h1 className="font-proximaNova text-3xl mb-6">Audio Analysis</h1>
					<div className="flex flex-wrap gap-4 justify-center">
						{[
							{
								title: "Key",
								val:
									[
										"C",
										"C#",
										"D",
										"D#",
										"E",
										"F",
										"F#",
										"G",
										"G#",
										"A",
										"A#",
										"B",
									][af?.key % 12] || "Unknown",
							},
							{ title: "Mode", val: af?.mode === 0 ? "Minor" : "Major" },
							{ title: "BPM", val: af?.tempo?.toFixed(1) },
							{
								title: "Overall Loudness",
								val: af?.loudness?.toFixed(2) + " dB",
							},
							{ title: "Time Signature", val: `${af?.time_signature}/4` },
						].map(stat => (
							<div
								key={stat.title}
								className="bg-[#303030] p-4 rounded-md min-w-[140px] text-center"
							>
								<h1 className="font-proximaNova text-xl text-gray-400">
									{stat.title}
								</h1>
								<p className="text-2xl mt-2 font-bold font-metropolis">
									{stat.val}
								</p>
							</div>
						))}
						{featureBars.map(feat => (
							<div
								key={feat.label}
								className="bg-[#303030] p-5 rounded-md w-full sxsm:w-[220px]"
							>
								<h1 className="font-proximaNova text-xl">
									{feat.label}
								</h1>
								<div className="mt-3">
									<ProgressBar progress={feat.val} />
									<p className="mt-2 text-sm text-right font-bold">
										{(feat.val / 100).toFixed(2)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function formatMilliseconds(ms: number) {
	if (!ms) return "0:00";
	const s = Math.floor(ms / 1000);
	const m = Math.floor(s / 60);
	return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}
