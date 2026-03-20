"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { Dropdown } from "@/components/Dropdown";

const typeOptions = [
	{ id: 1, value: "artists", label: "Artists" },
	{ id: 2, value: "tracks", label: "Songs" },
];

const periodOptions = [
	{ id: 1, value: "short_term", label: "Last 4 Weeks" },
	{ id: 2, value: "medium_term", label: "Last 6 Months" },
	{ id: 3, value: "long_term", label: "All Time" },
];

export const MobileTopLists = ({ topArtists, topTracks }: { topArtists: any; topTracks: any }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [topType, setTopType] = useState("artists");
	const [topPeriod, setTopPeriod] = useState("short_term");

	const dataList = (topType === "artists" ? topArtists : topTracks)[topPeriod]?.items || [];
	const visibleList = isExpanded ? dataList.slice(0, 50) : dataList.slice(0, 10);

	return (
		<div id="top-lists" className="bg-mgray rounded-md mt-8">
			<div className="p-5">
				<div className="flex flex-col xsm:flex-row xsm:items-center justify-between gap-4">
					<h1 className="font-proximaNova text-3xl">Top Lists</h1>
					<div className="flex gap-4">
						<Dropdown
							items={typeOptions}
							initialActiveId={1}
							onChange={setTopType}
						/>
						<Dropdown
							items={periodOptions}
							initialActiveId={1}
							onChange={setTopPeriod}
						/>
					</div>
				</div>

				<div className="mt-4 flex flex-col gap-2">
					{visibleList.map((item: any, index: number) => {
						const isArtist = topType === "artists";
						const href = isArtist
							? `/info/artist/${item.id}`
							: `/info/track/${item.id}`;
						const subtext = isArtist
							? item.genres?.length > 0
								? item.genres[0]
								: "No Genre"
							: item.artists.map((a: any) => a.name).join(", ");
						const imgUrl = isArtist
							? item.images?.[0]?.url
							: item.album?.images?.[0]?.url;

						return (
							<Link
								key={item.id}
								href={href}
								className="group p-3 flex items-center justify-between rounded-lg hover:bg-[#404040] transition duration-100"
							>
								<div className="flex items-center gap-4">
									<div className="relative h-[64px] w-[64px] shrink-0 rounded-md overflow-hidden bg-[#282828]">
										{imgUrl && (
											<Image
												alt="cover"
												src={imgUrl}
												layout="fill"
												objectFit="cover"
												unoptimized
												draggable={false}
											/>
										)}
									</div>
									<div className="flex flex-col overflow-hidden">
										<h1 className="text-xl xsm:text-2xl truncate w-[140px] xxsm:w-[155px] xsm:w-[200px]">
											<span className="text-gray-400 text-lg mr-2">
												{index + 1}.
											</span>
											{item.name}
										</h1>
										<h2 className="text-sm xsm:text-base text-gray-400 truncate w-[140px] xxsm:w-[155px] xsm:w-[200px]">
											{subtext}
										</h2>
									</div>
								</div>
								<a
									href={item.external_urls.spotify}
									target="_blank"
									rel="noreferrer"
									onClick={e => e.stopPropagation()}
									className="ml-2 text-gray-400 group-hover:text-white transition"
								>
									<FontAwesomeIcon icon={faSpotify} size="lg" />
								</a>
							</Link>
						);
					})}

					{dataList.length > 10 && (
						<div className="flex justify-center mt-2">
							<button
								onClick={() => setIsExpanded(!isExpanded)}
								className="h-[40px] w-[40px] rounded-full p-2 hover:bg-[#303030] transition duration-200 flex items-center justify-center"
							>
								<svg
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className={`transition-transform duration-300 ${isExpanded ? "-rotate-90" : "rotate-90"}`}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
