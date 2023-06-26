import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import Image from "next/image";
import { Sidebar } from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next";

const ArtistIndex: NextPage = (props: any) => {
	const router = useRouter();
	const { artist } = router.query;
	const [artistId, setArtistId] = useState(artist);
	const fetcher = (url: any) => fetch(url).then(r => r.json());
	useEffect(() => {
		if (!router.isReady) return;
		const { artist } = router.query;
		setArtistId(artist);
	}, [router.isReady, router.query]);

	const data = props.artist.data;
	const ttData = props.topTracks.data;
	const raData = props.relatedArtists.data;

	if (!data || !ttData || !raData) {
		return (
			<>
				<Sidebar />
				<div className="navbar:ml-[280px] flex font-metropolis text-white">
					<div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
						Failed to load artist data.
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<Sidebar />
			<div className="navbar:ml-[280px] flex font-metropolis text-white">
				<div className="m-8 flex flex-col 1.5xl:flex-row w-[100%] overflow-auto">
					<div className="1.5xl:w-[30%] flex flex-col md:flex-row 1.5xl:flex-col">
						<div className="flex justify-center items-center md:w-[50%] 1.5xl:w-auto">
							<div
								id="artist"
								className="bg-mgray rounded-md  1.5xl:w-auto 1.5xl:min-w-[50%] h-fit flex items-center justify-center"
							>
								<div className="p-5">
									<div className="flex flex-col items-center xsm:text-center w-fit">
										<div className="m-auto xsm:mx-0">
											<div className="relative h-[256px] w-[256px]">
												<Image
													alt="artistImage"
													draggable={false}
													src={data.images[0].url}
													layout="fill"
													objectFit="cover"
												/>
											</div>
										</div>
										<div className="mt-4 text-center">
											<h1 className="text-4xl">{data.name}</h1>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col w-[100%] justify-between">
							<div
								id="open-on-spotify"
								className="bg-mgray 1.5xl:w-auto md:ml-8 1.5xl:ml-0 rounded-md mt-8 md:mt-0 1.5xl:mt-8 h-fi hover:bg-[#404040] ease-in-out duration-100"
							>
								<a href={data.external_urls.spotify}>
									<div className="p-5 flex items-center justify-center">
										<FontAwesomeIcon icon={faSpotify} size="2x" />
										<h1 className="ml-2">Open on Spotify</h1>
									</div>
								</a>
							</div>
							<div id="followers" className="bg-mgray md:ml-8 1.5xl:ml-0 rounded-md mt-8 h-fit">
								<div className="p-5">
									<h1 className="font-proximaNova text-3xl">Followers</h1>
									<div className="mt-4">
										<h1 className="text-2xl">{numberWithCommas(data.followers.total)}</h1>
									</div>
								</div>
							</div>
							<div id="popularity" className="bg-mgray md:ml-8 1.5xl:ml-0 rounded-md mt-8 h-fit">
								<div className="p-5">
									<div className="flex items-center justify-between sm:justify-start">
										<h1 className="font-proximaNova text-3xl">Popularity</h1>
									</div>
									<div className="mt-4">
										<h1 className="text-2xl">{data.popularity / 10}</h1>
										<p>From 0-10</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="1.5xl:w-[70%] flex flex-col 1.5xl:ml-8">
						<div id="genres" className="mt-8 1.5xl:mt-0 bg-mgray rounded-md">
							<div className="p-5">
								<h1 className="font-proximaNova text-3xl">Genres</h1>
								<div className="mt-4">
									<div className="flex flex-wrap gap-4">
										{data.genres.map((genre: string, index: number) => (
											<div key={index + 1} className="bg-[#404040] rounded-lg">
												<h1 className="text-2xl m-2 mx-3">{genre}</h1>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
						<div id="top-tracks" className="bg-mgray rounded-md mt-8">
							<div className="p-5">
								<div className="flex items-center justify-between sm:justify-start">
									<h1 className="font-proximaNova text-3xl">Top Tracks</h1>
								</div>
								<div className="mt-4 w-[100%] flex gap-4 overflow-x-scroll">
									{ttData.tracks.map((track: any, index: number) => (
										<div key={index + 1}>
											<Link href={`/info/track/${track.id}`} key={index + 1}>
												<a className="hover:cursor-pointer">
													<div className="hover:bg-[#404040] rounded-lg ease-in-out duration-100 p-5">
														<div className="flex justify-center flex-col h-fit">
															<div className="mx-auto">
																<div className="relative h-[128px] w-[128px]">
																	<Image
																		alt="trackImage"
																		unoptimized
																		draggable={false}
																		src={track.album.images[0].url}
																		layout="fill"
																		objectFit="cover"
																	/>
																</div>
															</div>
															<div className="mt-2">
																<h1 className="text-xl line-clamp-2">{track.name}</h1>
																<p className="text-lg whitespace-nowrap text-ellipsis w-[128px] overflow-hidden">
																	{track.artists
																		.map((artist: any) => artist.name)
																		.join(", ")}
																</p>
															</div>
														</div>
													</div>
												</a>
											</Link>
										</div>
									))}
								</div>
							</div>
						</div>
						<div id="related-artists" className="bg-mgray rounded-md mt-8">
							<div className="p-5">
								<div className="flex items-center justify-between sm:justify-start">
									<h1 className="font-proximaNova text-3xl">Related Artists</h1>
								</div>
								<div className="mt-4 w-[100%] flex gap-4 overflow-x-scroll">
									{raData.artists.map((artist: any, index: number) => (
										<div key={index + 1}>
											<Link href={`/info/artist/${artist.id}`} key={index + 1}>
												<a className="hover:cursor-pointer">
													<div className="hover:bg-[#404040] rounded-lg ease-in-out duration-100 p-5">
														<div className="flex justify-center flex-col h-fit">
															<div className="mx-auto">
																<div className="relative h-[128px] w-[128px]">
																	{artist.images.length !== 0 ? (
																		<Image
																			alt="relatedArtistImage"
																			unoptimized
																			draggable={false}
																			src={artist.images[0]?.url}
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
															<div className="mt-2">
																<h1 className="text-xl line-clamp-2">{artist.name}</h1>
															</div>
														</div>
													</div>
												</a>
											</Link>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const get_artist = async (ctx: any) => {
	const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/artists/${ctx.params.artist}`;
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			access_token: getCookie("acct", { req: ctx.req, res: ctx.res }),
			refresh_token: getCookie("reft", { req: ctx.req, res: ctx.res }),
		}),
	}).then(res => res.json());
	if (res.status == 401 || res.status == 400) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	if (res.status == 201) {
		setCookie("acct", res.access_token, { req: ctx.req, res: ctx.res, maxAge: res.expires_in });
	}
	return res;
};

const get_artist_tt = async (ctx: any) => {
	const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/artists/${ctx.params.artist}/toptracks`;
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			access_token: getCookie("acct", { req: ctx.req, res: ctx.res }),
			refresh_token: getCookie("reft", { req: ctx.req, res: ctx.res }),
		}),
	}).then(res => res.json());
	if (res.status == 401 || res.status == 400) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	if (res.status == 201) {
		setCookie("acct", res.access_token, { req: ctx.req, res: ctx.res, maxAge: res.expires_in });
	}
	return res;
};

const get_artist_ra = async (ctx: any) => {
	const url = `${process.env.NEXT_PUBLIC_API_URL}/spotify/artists/${ctx.params.artist}/relatedartists`;
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify({
			access_token: getCookie("acct", { req: ctx.req, res: ctx.res }),
			refresh_token: getCookie("reft", { req: ctx.req, res: ctx.res }),
		}),
	}).then(res => res.json());
	if (res.status == 401 || res.status == 400) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	if (res.status == 201) {
		setCookie("acct", res.access_token, { req: ctx.req, res: ctx.res, maxAge: res.expires_in });
	}
	return res;
};

export async function getServerSideProps(ctx: any) {
	const artist = await get_artist(ctx);
	const tt = await get_artist_tt(ctx);
	const ra = await get_artist_ra(ctx);
	return {
		props: {
			artist,
			topTracks: tt,
			relatedArtists: ra,
		},
	};
}

export default ArtistIndex;

function numberWithCommas(number: number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
