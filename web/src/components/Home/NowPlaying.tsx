import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

export const NowPlaying = ({ playing }: { playing: any }) => {
	return (
		<div className="bg-mgray rounded-md h-fit p-5">
			<h1 className="font-proximaNova text-3xl">Now Playing</h1>
			<div className="mt-4">
				{playing?.item ? (
					<Link
						href={`/info/track/${playing.item.id}`}
						className="block group hover:bg-[#404040] rounded-lg transition duration-100 p-2"
					>
						<div className="flex flex-col text-center xsm:text-left xsm:flex-row items-center">
							<div className="relative h-[128px] w-[128px] shrink-0 bg-[#282828] rounded-md overflow-hidden">
								<Image
									alt="albumArt"
									unoptimized
									draggable={false}
									src={playing.item.album.images[0].url}
									layout="fill"
									objectFit="cover"
								/>
							</div>
							<div className="mt-4 xsm:mt-0 xsm:ml-4 flex flex-col overflow-hidden w-full">
								<h1 className="text-2xl truncate">
									{playing.item.name}
								</h1>
								<h2 className="text-gray-400 truncate">
									{playing.item.artists
										.map((a: any) => a.name)
										.join(", ")}
								</h2>
								<a
									href={playing.item.external_urls.spotify}
									target="_blank"
									rel="noreferrer"
									onClick={e => e.stopPropagation()}
									className="mt-2 text-gray-400 hover:text-white transition w-fit mx-auto xsm:mx-0"
								>
									<FontAwesomeIcon icon={faSpotify} size="lg" />
								</a>
							</div>
						</div>
					</Link>
				) : (
					<h1 className="text-2xl text-gray-400">Nothing Playing</h1>
				)}
			</div>
		</div>
	);
};
