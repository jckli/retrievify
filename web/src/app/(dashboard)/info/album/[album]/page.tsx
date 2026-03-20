"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { fetcher } from "@/utils/fetcher";

export default function AlbumIndex() {
	const params = useParams();
	const albumId = params.album;

	const { data, error, isLoading } = useSWR(albumId ? `/retrievify/spotify/albums/${albumId}` : null, fetcher);

	if (isLoading || error) {
		return (
			<div className="flex h-screen items-center justify-center font-proximaNova">
				{error ? "Failed to load album data." : "Loading..."}
			</div>
		);
	}

	return (
		<>
			<div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
				<div className="lg:col-span-4 xxl:col-span-3 flex flex-col gap-8">
					<div className="bg-mgray rounded-md p-5 flex flex-col items-center text-center">
						<div className="relative h-[256px] w-[256px]">
							<Image
								alt="albumArt"
								src={data?.images?.[0]?.url}
								layout="fill"
								unoptimized
								draggable={false}
							/>
						</div>
						<h1 className="text-4xl mt-4">{data?.name}</h1>
					</div>

					<div className="flex flex-col gap-4">
						<a
							href={data?.external_urls?.spotify}
							className="bg-mgray p-5 rounded-md flex items-center justify-center hover:bg-[#404040] transition"
						>
							<FontAwesomeIcon icon={faSpotify} size="2x" />
							<h1 className="ml-2">Open on Spotify</h1>
						</a>
						<div className="bg-mgray p-5 rounded-md">
							<h1 className="font-proximaNova text-3xl">Release Date</h1>
							<h1 className="text-2xl mt-4">
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
						<div className="bg-mgray p-5 rounded-md">
							<h1 className="font-proximaNova text-3xl">Popularity</h1>
							<h1 className="text-2xl mt-4">{data?.popularity / 10}</h1>
							<p>From 0-10</p>
						</div>
					</div>
				</div>

				<div className="lg:col-span-8 xxl:col-span-9 flex flex-col gap-8">
					<div className="bg-mgray rounded-md p-5">
						<h1 className="font-proximaNova text-3xl">
							Total Tracks: {data?.total_tracks}
						</h1>
					</div>

					<div className="bg-mgray rounded-md p-5">
						<h1 className="font-proximaNova text-3xl mb-4">Tracks</h1>
						<div className="flex flex-col gap-2">
							{data?.tracks?.items?.map((track: any) => (
								<Link key={track.id} href={`/info/track/${track.id}`}>
									<div className="p-3 flex items-center justify-between rounded-md hover:bg-[#404040] transition">
										<div>
											<h1 className="text-2xl">
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
										<p>
											{formatMilliseconds(
												track.duration_ms,
											)}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function formatMilliseconds(ms: number) {
	const s = Math.floor(ms / 1000);
	const m = Math.floor(s / 60);
	return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}
