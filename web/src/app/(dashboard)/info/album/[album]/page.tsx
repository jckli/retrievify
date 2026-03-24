"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faChartBar, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { fetcher } from "@/utils/fetcher";

export default function AlbumIndex() {
	const params = useParams();
	const albumId = params.album;

	const { data, error, isLoading } = useSWR(albumId ? `/retrievify/spotify/albums/${albumId}` : null, fetcher);
	const { data: statData } = useSWR(
		albumId ? `/retrievify/spotify/scrobbler/item/albums/${albumId}` : null,
		fetcher,
	);
	const myStats = statData?.data;

	if (isLoading || error || !data) {
		return (
			<div className="flex items-center justify-center font-proximaNova min-h-[70vh]">
				{error ? "Failed to load album data." : "Loading..."}
			</div>
		);
	}

	return (
		<div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full animate-in fade-in">
			<div className="lg:col-span-4 xxl:col-span-3 flex flex-col gap-8">
				<div className="bg-mgray rounded-md p-5 flex flex-col items-center text-center">
					<div className="relative h-[256px] w-[256px]">
						<Image
							alt="albumArt"
							src={data?.images?.[0]?.url || "/images/logo.png"}
							layout="fill"
							unoptimized
							draggable={false}
							className="rounded-md object-cover"
						/>
					</div>
					<h1 className="text-4xl mt-4 font-metropolis font-bold">{data?.name}</h1>
					<p className="text-gray-400 text-lg mt-1">
						{data?.artists?.map((a: any) => a.name).join(", ")}
					</p>
				</div>

				<div className="flex flex-col gap-4">
					<a
						href={data?.external_urls?.spotify}
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
								Released
							</h1>
							<h1 className="text-xl mt-1 font-bold">
								{new Date(data?.release_date).toLocaleDateString(
									"en-US",
									{
										year: "numeric",
										month: "short",
										day: "numeric",
									},
								)}
							</h1>
						</div>
						<div className="text-right">
							<h1 className="font-proximaNova text-2xl text-gray-400">
								Popularity
							</h1>
							<h1 className="text-xl mt-1 font-bold">
								{data?.popularity / 10} / 10
							</h1>
						</div>
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
				<div className="bg-mgray rounded-md p-5 flex items-center justify-between">
					<h1 className="font-proximaNova text-3xl">Tracklist</h1>
					<span className="bg-[#404040] text-gray-300 px-4 py-1.5 rounded-full font-bold">
						{data?.total_tracks} Tracks
					</span>
				</div>

				<div className="bg-mgray rounded-md p-5">
					<div className="flex flex-col gap-2">
						{data?.tracks?.items?.map((track: any, index: number) => (
							<Link key={track.id} href={`/info/track/${track.id}`}>
								<div className="p-3 flex items-center justify-between rounded-md hover:bg-[#404040] transition cursor-pointer group border border-transparent">
									<div className="flex items-center space-x-4">
										<span className="w-6 text-center text-gray-500 font-bold">
											{track.track_number ||
												index + 1}
										</span>
										<div>
											<h1 className="text-xl font-bold font-metropolis group-hover:text-[var(--color-primary)] transition-colors">
												{track.name}
											</h1>
											<p className="text-sm text-gray-400">
												{track.artists
													.map(
														(
															a: any,
														) =>
															a.name,
													)
													.join(", ")}
											</p>
										</div>
									</div>
									<p className="text-gray-400 font-bold font-proximaNova">
										{formatMilliseconds(track.duration_ms)}
									</p>
								</div>
							</Link>
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
