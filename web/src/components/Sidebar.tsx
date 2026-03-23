"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Menu,
	MenuButton,
	MenuItems,
	MenuItem,
	Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faChartBar } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Squash as Hamburger } from "hamburger-react";
import { fetcher } from "@/utils/fetcher";
import { usePathname } from "next/navigation";

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(" ");
}

export const Sidebar = () => {
	const isDesktop = useMediaQuery("894px");

	const pathname = usePathname();

	const navigation = [
		{ name: "Home", icon: faHouse, href: "/home", current: pathname.includes("/home") },
		{
			name: "Scrobbling",
			href: "/scrobbling",
			icon: faChartBar,
			current: pathname.includes("/scrobbling"),
		},
	];

	const { data: res } = useSWR(`/retrievify/spotify/getuser`, fetcher, { revalidateOnFocus: false });
	const user = res?.data;

	const UserDropdown = () => (
		<Menu as="div" className="relative z-50">
			<MenuButton
				className={`flex items-center text-sm rounded-full focus:outline-none ring-2 ring-transparent hover:ring-[#606060] transition cursor-pointer ${isDesktop ? "pr-4" : ""}`}
			>
				<div className="relative h-9 w-9 shrink-0 rounded-full bg-[#282828] overflow-hidden flex items-center justify-center">
					{user?.images?.[0]?.url ? (
						<Image
							alt="user-pfp"
							src={user.images[0].url}
							layout="fill"
							objectFit="cover"
							unoptimized
						/>
					) : (
						<svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#7f7f7f]">
							<path d="M10.165 11.101a2.5 2.5 0 01-.67 3.766L5.5 17.173A2.998 2.998 0 004 19.771v.232h16.001v-.232a3 3 0 00-1.5-2.598l-3.995-2.306a2.5 2.5 0 01-.67-3.766l.521-.626.002-.002c.8-.955 1.303-1.987 1.375-3.19.041-.706-.088-1.433-.187-1.727a3.717 3.717 0 00-.768-1.334 3.767 3.767 0 00-5.557 0c-.34.37-.593.82-.768 1.334-.1.294-.228 1.021-.187 1.727.072 1.203.575 2.235 1.375 3.19l.002.002.521.626zm5.727.657l-.52.624a.5.5 0 00.134.753l3.995 2.306a5 5 0 012.5 4.33v2.232H2V19.77a5 5 0 012.5-4.33l3.995-2.306a.5.5 0 00.134-.753l-.518-.622-.002-.002c-1-1.192-1.735-2.62-1.838-4.356-.056-.947.101-1.935.29-2.49A5.713 5.713 0 017.748 2.87a5.768 5.768 0 018.505 0 5.713 5.713 0 011.187 2.043c.189.554.346 1.542.29 2.489-.103 1.736-.838 3.163-1.837 4.355m-.001.001z"></path>
						</svg>
					)}
				</div>
				{isDesktop && (
					<span className="ml-3 text-sm font-medium text-white truncate max-w-[150px]">
						{user?.display_name || "Loading..."}
					</span>
				)}
			</MenuButton>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
			>
				<MenuItems
					className={`absolute mt-2 w-48 rounded-md bg-[#404040] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isDesktop ? "bottom-16 left-0" : "right-0 origin-top-right"}`}
				>
					<div className="p-1">
						<MenuItem>
							<Link
								href="/privacy"
								className="block px-4 py-2 text-sm text-white data-[focus]:bg-[#505050] rounded-md transition"
							>
								Privacy Policy
							</Link>
						</MenuItem>
						<MenuItem>
							<a
								href="https://spotify.com/us/account/apps"
								className="block px-4 py-2 text-sm text-white data-[focus]:bg-[#505050] rounded-md transition"
							>
								Remove Account
							</a>
						</MenuItem>
						<MenuItem>
							<a
								href="https://spotify.com/logout"
								className="block px-4 py-2 text-sm text-white data-[focus]:bg-[#505050] rounded-md transition"
							>
								Sign Out
							</a>
						</MenuItem>
					</div>
				</MenuItems>
			</Transition>
		</Menu>
	);

	if (isDesktop) {
		return (
			<div className="flex flex-col w-[280px] h-screen fixed bg-mgray font-metropolis z-40">
				<div className="flex flex-col pt-5 pb-4 overflow-y-auto h-full">
					<div className="px-5">
						<Link href="/" className="flex items-center">
							<div className="relative h-[38px] w-[38px]">
								<Image
									alt="logo"
									src="/images/logo.png"
									layout="fill"
									draggable={false}
								/>
							</div>
							<h1 className="text-white font-proximaNova text-2xl font-bold ml-2">
								Retrievify
							</h1>
						</Link>
					</div>
					<nav className="mt-8 flex-1 px-4 space-y-2">
						{navigation.map(item => (
							<Link
								key={item.name}
								href={item.href}
								className={classNames(
									item.current
										? "bg-[#303030] text-white"
										: "text-gray-300 hover:bg-[#404040] hover:text-white",
									"group flex items-center px-3 py-3 text-sm font-medium rounded-md transition",
								)}
							>
								<FontAwesomeIcon
									icon={item.icon}
									className={classNames(
										item.current
											? "text-gray-300"
											: "text-gray-400 group-hover:text-gray-300",
										"mr-3 h-5 w-5",
									)}
								/>
								{item.name}
							</Link>
						))}
					</nav>
				</div>
				<div className="bg-[#303030] p-4">
					<UserDropdown />
				</div>
			</div>
		);
	}

	return (
		<Disclosure as="nav" className="bg-mgray font-metropolis sticky top-0 z-40">
			{({ open }) => (
				<>
					<div className="px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<DisclosureButton className="text-gray-400 hover:text-white hover:bg-[#404040] rounded-md p-1 transition cursor-pointer">
								<Hamburger toggled={open} size={24} />
							</DisclosureButton>
							<Link
								href="/"
								className="flex items-center absolute left-1/2 transform -translate-x-1/2"
							>
								<div className="relative h-8 w-8">
									<Image
										alt="logo"
										src="/images/logo.png"
										layout="fill"
									/>
								</div>
							</Link>
							<UserDropdown />
						</div>
					</div>
					<DisclosurePanel className="px-2 pt-2 pb-3 space-y-1">
						{navigation.map(item => (
							<DisclosureButton
								key={item.name}
								as={Link}
								href={item.href}
								className={classNames(
									item.current
										? "bg-[#303030] text-white"
										: "text-gray-300 hover:bg-[#404040]",
									"block px-3 py-2 rounded-md text-base font-medium transition",
								)}
							>
								{item.name}
							</DisclosureButton>
						))}
					</DisclosurePanel>
				</>
			)}
		</Disclosure>
	);
};
