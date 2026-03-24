"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { faChartBar, faClock, faCalendar } from "@fortawesome/free-solid-svg-icons";
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
	const { data: statData } = useSWR(
		artistId ? `/retrievify/spotify/scrobbler/item/artists/${artistId}` : null,
		fetcher,
	);
	const myStats = statData?.data;

	if (!artist || !topTracks || !related || e1 || e2 || e3) {
		return (
			<div className="flex items-center justify-center font-proximaNova min-h-[70vh]">
				{e1 || e2 || e3 ? "Failed to load artist data." : "Loading..."}
			</div>
		);
	}

	return (
		<div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full animate-in fade-in">
			<div className="lg:col-span-4 xxl:col-span-3 flex flex-col gap-8">
				<div className="bg-mgray rounded-md p-5 flex flex-col items-center text-center">
					<div className="relative h-[256px] w-[256px]">
						<Image
							alt="artistImage"
							src={artist?.images?.[0]?.url || "/images/logo.png"}
							layout="fill"
							objectFit="cover"
							unoptimized
							draggable={false}
							className="rounded-md"
						/>
					</div>
					<h1 className="text-4xl mt-4 font-metropolis font-bold">{artist?.name}</h1>
				</div>

				<div className="flex flex-col gap-4">
					<a
						href={artist?.external_urls?.spotify}
						target="_blank"
						rel="noreferrer"
						className="bg-mgray p-5 rounded-md flex items-center justify-center hover:bg-[#404040] transition cursor-pointer"
					>
						<FontAwesomeIcon icon={faSpotify} size="2x" />
						<h1 className="ml-2 font-bold font-metropolis">Open on Spotify</h1>
					</a>

					<div className="bg-mgray p-5 rounded-md">
						<h1 className="font-proximaNova text-3xl">Followers</h1>
						<h1 className="text-2xl mt-4 font-bold">
							{artist?.followers?.total?.toLocaleString()}
						</h1>
					</div>

					<div className="bg-mgray p-5 rounded-md">
						<h1 className="font-proximaNova text-3xl">Popularity</h1>
						<h1 className="text-2xl mt-4 font-bold">{artist?.popularity / 10}</h1>
						<p className="text-gray-400 mt-1">From 0-10</p>
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
				{artist?.genres?.length > 0 && (
					<div className="bg-mgray rounded-md p-5">
						<h1 className="font-proximaNova text-3xl mb-4">Genres</h1>
						<div className="flex flex-wrap gap-3">
							{artist.genres.map((g: string) => (
								<span
									key={g}
									className="bg-[#404040] rounded-lg px-4 py-2 text-xl capitalize"
								>
									{g}
								</span>
							))}
						</div>
					</div>
				)}

				<div className="bg-mgray rounded-md p-5">
					<h1 className="font-proximaNova text-3xl mb-4">Top Tracks</h1>
					<div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
						{topTracks?.tracks?.map((track: any) => (
							<Link key={track.id} href={`/info/track/${track.id}`}>
								<div className="min-w-[160px] hover:bg-[#404040] rounded-lg p-3 transition cursor-pointer group">
									<div className="relative h-[128px] w-[128px] mx-auto rounded-md overflow-hidden">
										<Image
											alt="trackImage"
											src={
												track.album?.images?.[0]
													?.url ||
												"/images/logo.png"
											}
											layout="fill"
											objectFit="cover"
											unoptimized
											className="group-hover:scale-105 transition-transform"
										/>
									</div>
									<h1 className="text-lg mt-3 truncate w-[128px] mx-auto font-bold group-hover:text-[var(--color-primary)] transition-colors">
										{track.name}
									</h1>
									<p className="text-sm text-gray-400 truncate w-[128px] mx-auto">
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
					<div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
						{related?.artists?.map((ra: any) => (
							<Link key={ra.id} href={`/info/artist/${ra.id}`}>
								<div className="min-w-[160px] hover:bg-[#404040] rounded-lg p-3 transition cursor-pointer group">
									<div className="relative h-[128px] w-[128px] mx-auto bg-[#282828] rounded-full overflow-hidden flex items-center justify-center">
										{ra.images?.length > 0 ? (
											<Image
												alt="relatedArtist"
												src={ra.images[0].url}
												layout="fill"
												objectFit="cover"
												unoptimized
												className="group-hover:scale-105 transition-transform"
											/>
										) : (
											<span className="text-gray-500 font-bold">
												No Image
											</span>
										)}
									</div>
									<h1 className="text-lg mt-3 text-center truncate w-[128px] mx-auto font-bold group-hover:text-[var(--color-primary)] transition-colors">
										{ra.name}
									</h1>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
