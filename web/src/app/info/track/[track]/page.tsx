"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
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

	if (!track || !af || e1 || e2) {
		return (
			<div className="flex navbar:ml-[280px] h-screen items-center justify-center font-proximaNova text-white bg-[#101010]">
				<Sidebar />
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
		<div className="flex font-metropolis text-white bg-[#101010] min-h-screen">
			<Sidebar />
			<div className="navbar:ml-[280px] p-6 sm:p-8 grid grid-cols-1 xxl:grid-cols-2 gap-8 w-full">
				<div className="xxl:w-[30%] flex flex-col gap-8">
					<div className="bg-mgray rounded-md p-5 flex flex-col items-center text-center">
						<div className="relative h-[256px] w-[256px]">
							<Image
								alt="trackArt"
								src={track?.album?.images?.[0]?.url}
								layout="fill"
								unoptimized
								draggable={false}
							/>
						</div>
						<h1 className="text-4xl mt-4">{track?.name}</h1>
						<p className="text-gray-400 text-lg mt-1">
							{track?.artists?.map((a: any) => a.name).join(", ")}
						</p>
					</div>

					<div className="flex flex-col gap-4">
						<a
							href={track?.external_urls?.spotify}
							className="bg-mgray p-5 rounded-md flex items-center justify-center hover:bg-[#404040] transition"
						>
							<FontAwesomeIcon icon={faSpotify} size="2x" />
							<h1 className="ml-2">Open on Spotify</h1>
						</a>
						<div className="bg-mgray p-5 rounded-md flex justify-between">
							<div>
								<h1 className="font-proximaNova text-2xl text-gray-400">
									Duration
								</h1>
								<h1 className="text-xl mt-1">
									{formatMilliseconds(track?.duration_ms)}
								</h1>
							</div>
							<div className="text-right">
								<h1 className="font-proximaNova text-2xl text-gray-400">
									Popularity
								</h1>
								<h1 className="text-xl mt-1">
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
											src={
												track?.album
													?.images?.[0]
													?.url
											}
											layout="fill"
											unoptimized
										/>
									</div>
									<div>
										<h1 className="text-xl">
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
					</div>
				</div>

				<div className="xxl:w-[70%] flex flex-col gap-8">
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
								{
									title: "Mode",
									val: af?.mode === 0 ? "Minor" : "Major",
								},
								{ title: "BPM", val: af?.tempo?.toFixed(1) },
								{
									title: "Overall Loudness",
									val: af?.loudness?.toFixed(2) + " dB",
								},
								{
									title: "Time Signature",
									val: `${af?.time_signature}/4`,
								},
							].map(stat => (
								<div
									key={stat.title}
									className="bg-[#303030] p-4 rounded-md min-w-[140px] text-center"
								>
									<h1 className="font-proximaNova text-xl text-gray-400">
										{stat.title}
									</h1>
									<p className="text-2xl mt-2">{stat.val}</p>
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
										<p className="mt-2 text-sm text-right">
											{(feat.val / 100).toFixed(2)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function formatMilliseconds(ms: number) {
	const s = Math.floor(ms / 1000);
	const m = Math.floor(s / 60);
	return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}
