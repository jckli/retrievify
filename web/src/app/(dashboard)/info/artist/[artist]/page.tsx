"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { fetcher } from "@/utils/fetcher";

export default function ArtistIndex() {
	const params = useParams();
	const artistId = params.artist;

	const { data: artist, error: e1 } = useSWR(
		artistId ? `/retrievify/spotify/artists/${artistId}` : null,
		fetcher,
	);
	const { data: topTracks, error: e2 } = useSWR(
		artistId ? `/retrievify/spotify/artists/${artistId}/toptracks` : null,
		fetcher,
	);
	const { data: related, error: e3 } = useSWR(
		artistId ? `/retrievify/spotify/artists/${artistId}/relatedartists` : null,
		fetcher,
	);

	if (!artist || !topTracks || !related || e1 || e2 || e3) {
		return (
			<div className="flex h-screen items-center justify-center font-proximaNova">
				{e1 || e2 || e3 ? "Failed to load artist data." : "Loading..."}
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
								alt="artistImage"
								src={artist?.images?.[0]?.url}
								layout="fill"
								objectFit="cover"
								unoptimized
								draggable={false}
							/>
						</div>
						<h1 className="text-4xl mt-4">{artist?.name}</h1>
					</div>

					<div className="flex flex-col gap-4">
						<a
							href={artist?.external_urls?.spotify}
							className="bg-mgray p-5 rounded-md flex items-center justify-center hover:bg-[#404040] transition"
						>
							<FontAwesomeIcon icon={faSpotify} size="2x" />
							<h1 className="ml-2">Open on Spotify</h1>
						</a>
						<div className="bg-mgray p-5 rounded-md">
							<h1 className="font-proximaNova text-3xl">Followers</h1>
							<h1 className="text-2xl mt-4">
								{artist?.followers?.total?.toLocaleString()}
							</h1>
						</div>
						<div className="bg-mgray p-5 rounded-md">
							<h1 className="font-proximaNova text-3xl">Popularity</h1>
							<h1 className="text-2xl mt-4">{artist?.popularity / 10}</h1>
							<p>From 0-10</p>
						</div>
					</div>
				</div>

				<div className="lg:col-span-8 xxl:col-span-9 flex flex-col gap-8">
					{artist?.genres?.length > 0 && (
						<div className="bg-mgray rounded-md p-5">
							<h1 className="font-proximaNova text-3xl mb-4">Genres</h1>
							<div className="flex flex-wrap gap-3">
								{artist.genres.map((g: string) => (
									<span
										key={g}
										className="bg-[#404040] rounded-lg px-4 py-2 text-xl"
									>
										{g}
									</span>
								))}
							</div>
						</div>
					)}

					<div className="bg-mgray rounded-md p-5">
						<h1 className="font-proximaNova text-3xl mb-4">Top Tracks</h1>
						<div className="flex gap-4 overflow-x-auto pb-4">
							{topTracks?.tracks?.map((track: any) => (
								<Link key={track.id} href={`/info/track/${track.id}`}>
									<div className="min-w-[160px] hover:bg-[#404040] rounded-lg p-3 transition">
										<div className="relative h-[128px] w-[128px] mx-auto">
											<Image
												alt="trackImage"
												src={
													track.album
														.images[0]
														.url
												}
												layout="fill"
												objectFit="cover"
												unoptimized
											/>
										</div>
										<h1 className="text-lg mt-2 truncate w-[128px]">
											{track.name}
										</h1>
										<p className="text-sm text-gray-400 truncate w-[128px]">
											{track.artists
												.map((a: any) => a.name)
												.join(", ")}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>

					<div className="bg-mgray rounded-md p-5">
						<h1 className="font-proximaNova text-3xl mb-4">Related Artists</h1>
						<div className="flex gap-4 overflow-x-auto pb-4">
							{related?.artists?.map((ra: any) => (
								<Link key={ra.id} href={`/info/artist/${ra.id}`}>
									<div className="min-w-[160px] hover:bg-[#404040] rounded-lg p-3 transition">
										<div className="relative h-[128px] w-[128px] mx-auto bg-[#282828] rounded-full overflow-hidden flex items-center justify-center">
											{ra.images?.length > 0 ? (
												<Image
													alt="relatedArtist"
													src={
														ra
															.images[0]
															.url
													}
													layout="fill"
													objectFit="cover"
													unoptimized
												/>
											) : (
												<span className="text-gray-500">
													No Image
												</span>
											)}
										</div>
										<h1 className="text-lg mt-2 text-center truncate w-[128px]">
											{ra.name}
										</h1>
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
