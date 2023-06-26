import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { PeriodDropdown } from "../PeriodDropdown";

export const TopArtists = (props: any) => {
	const [height, setHeight] = useState("0px");
	const [rotate, setRotate] = useState("rotate-90");
	const [periodArtist, setPeriodArtist] = useState("short_term");
	const expand = () => {
		height == "0px" ? setHeight("300rem") : setHeight("0px");
		rotate == "-rotate-90" ? setRotate("rotate-90") : setRotate("-rotate-90");
	};
	return (
		<>
			<div id="top-artists" className="bg-mgray rounded-md mt-8">
				<div className="p-5">
					<div className="flex items-center justify-between sm:justify-start">
						<h1 className="font-proximaNova text-3xl">Top Artists</h1>
						<div className="ml-4">
							<PeriodDropdown setPeriod={setPeriodArtist} />
						</div>
					</div>
					<div className="mt-4">
						<div className="flex flex-col">
							{props.topArtists[periodArtist]?.items.slice(0, 10).map((artist: any, index: number) => (
								<div
									key={index}
									className="mt-2 p-2 rounded-lg hover:bg-[#404040] ease-in-out duration-100"
								>
									<Link href={`/info/artist/${artist.id}`}>
										<div className="hover:cursor-pointer">
											<div className="flex items-center justify-between">
												<div className="flex items-center">
													<div>
														<div className="relative h-[64px] w-[64px]">
															{artist.images.length !== 0 ? (
																<Image
																	alt="albumArt"
																	unoptimized
																	draggable={false}
																	src={artist.images[0].url}
																	layout="fill"
																	objectFit="cover"
																/>
															) : (
																<div className="bg-[#282828] h-full flex justify-center items-center">
																	<svg
																		role="img"
																		height="50"
																		width="50"
																		aria-hidden="true"
																		data-testid="user"
																		viewBox="0 0 24 24"
																		data-encore-id="icon"
																		className="fill-[#7f7f7f]"
																	>
																		<path d="M10.165 11.101a2.5 2.5 0 01-.67 3.766L5.5 17.173A2.998 2.998 0 004 19.771v.232h16.001v-.232a3 3 0 00-1.5-2.598l-3.995-2.306a2.5 2.5 0 01-.67-3.766l.521-.626.002-.002c.8-.955 1.303-1.987 1.375-3.19.041-.706-.088-1.433-.187-1.727a3.717 3.717 0 00-.768-1.334 3.767 3.767 0 00-5.557 0c-.34.37-.593.82-.768 1.334-.1.294-.228 1.021-.187 1.727.072 1.203.575 2.235 1.375 3.19l.002.002.521.626zm5.727.657l-.52.624a.5.5 0 00.134.753l3.995 2.306a5 5 0 012.5 4.33v2.232H2V19.77a5 5 0 012.5-4.33l3.995-2.306a.5.5 0 00.134-.753l-.518-.622-.002-.002c-1-1.192-1.735-2.62-1.838-4.356-.056-.947.101-1.935.29-2.49A5.713 5.713 0 017.748 2.87a5.768 5.768 0 018.505 0 5.713 5.713 0 011.187 2.043c.189.554.346 1.542.29 2.489-.103 1.736-.838 3.163-1.837 4.355m-.001.001z"></path>
																	</svg>
																</div>
															)}
														</div>
													</div>
													<div className="ml-4">
														<h1 className="text-2xl">{artist.name}</h1>
														<h2>
															{artist.genres.length > 0 ? artist.genres[0] : "No Genre"}
														</h2>
													</div>
												</div>
												<a href={artist.external_urls.spotify} className="ml-2">
													<FontAwesomeIcon icon={faSpotify} size="lg" />
												</a>
											</div>
										</div>
									</Link>
								</div>
							))}
							<div className="overflow-hidden transition-all duration-200" style={{ maxHeight: height }}>
								{props.topArtists[periodArtist]?.items.slice(10, 50).map((item: any, index: number) => (
									<div
										key={index}
										className="mt-2 p-2 rounded-lg hover:bg-[#404040] ease-in-out duration-100"
									>
										<Link href={`/info/artist/${item.id}`}>
											<div className="hover:cursor-pointer">
												<div className="flex items-center justify-between">
													<div className="flex items-center">
														<div>
															<div className="relative h-[64px] w-[64px]">
																{item.images.length !== 0 ? (
																	<Image
																		alt="albumArt"
																		unoptimized
																		draggable={false}
																		src={item.images[0].url}
																		layout="fill"
																		objectFit="cover"
																	/>
																) : (
																	<div className="bg-[#282828] h-full flex justify-center items-center">
																		<svg
																			role="img"
																			height="50"
																			width="50"
																			aria-hidden="true"
																			data-testid="user"
																			viewBox="0 0 24 24"
																			data-encore-id="icon"
																			className="fill-[#7f7f7f]"
																		>
																			<path d="M10.165 11.101a2.5 2.5 0 01-.67 3.766L5.5 17.173A2.998 2.998 0 004 19.771v.232h16.001v-.232a3 3 0 00-1.5-2.598l-3.995-2.306a2.5 2.5 0 01-.67-3.766l.521-.626.002-.002c.8-.955 1.303-1.987 1.375-3.19.041-.706-.088-1.433-.187-1.727a3.717 3.717 0 00-.768-1.334 3.767 3.767 0 00-5.557 0c-.34.37-.593.82-.768 1.334-.1.294-.228 1.021-.187 1.727.072 1.203.575 2.235 1.375 3.19l.002.002.521.626zm5.727.657l-.52.624a.5.5 0 00.134.753l3.995 2.306a5 5 0 012.5 4.33v2.232H2V19.77a5 5 0 012.5-4.33l3.995-2.306a.5.5 0 00.134-.753l-.518-.622-.002-.002c-1-1.192-1.735-2.62-1.838-4.356-.056-.947.101-1.935.29-2.49A5.713 5.713 0 017.748 2.87a5.768 5.768 0 018.505 0 5.713 5.713 0 011.187 2.043c.189.554.346 1.542.29 2.489-.103 1.736-.838 3.163-1.837 4.355m-.001.001z"></path>
																		</svg>
																	</div>
																)}
															</div>
														</div>
														<div className="ml-4">
															<h1 className="text-2xl">{item.name}</h1>
															<h2>
																{item.genres.length > 0 ? item.genres[0] : "No Genre"}
															</h2>
														</div>
													</div>
													<a href={item.external_urls.spotify} className="ml-2">
														<FontAwesomeIcon icon={faSpotify} size="lg" />
													</a>
												</div>
											</div>
										</Link>
									</div>
								))}
							</div>
							<div className="flex items-center justify-center">
								<button
									onClick={() => {
										expand();
									}}
								>
									<svg
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										height="1em"
										className={`h-[40px] min-w-[40px] rounded-full p-[4px] hover:bg-[#303030] ease-in-out duration-200 dark:hover:bg-gray-100/5 origin-center transition-all ${rotate}`}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 5l7 7-7 7"
										></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
