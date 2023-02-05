import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { Squash as Hamburger } from "hamburger-react";
import { getCookie, setCookie } from "cookies-next";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export const Sidebar = (props: any) => {
    const isBreakpoint = useMediaQuery("894px");
    var active = props.active;
    const navigation = [
        { name: "Home", icon: faHouse, href: "/home", count: 0, current: active == 1 },
        { name: "Data Package", icon: faBoxOpen, href: "/package", count: 0, current: active == 2 },
    ];

    const fetcher = (url: any) => fetch(url).then(r => r.json());
    const { data: raw, error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/spotify/getuser`,
        (url: any) =>
            fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    access_token: getCookie("acct"),
                    refresh_token: getCookie("reft"),
                }),
            }).then(r => r.json()),
        { revalidateOnFocus: false }
    );
    if (!raw || error) {
        return (
            <div className="flex w-[100vw] h-[100vh] items-center justify-center text-white font-proximaNova">
                Loading...
            </div>
        );
    }
    if (raw.status == 201) {
        setCookie("acct", raw.access_token, { maxAge: raw.expires_in });
        setCookie("reft", raw.data.refresh_token);
    }
    const data = raw.data;

    const MobileNavigation = () => {
        return (
            <Disclosure as="nav" className="bg-mgray">
                {({ open }) => (
                    <>
                        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 font-metropolis">
                            <div className="relative flex items-center justify-between h-16">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        {({ open }) => <Hamburger toggled={open} size={24} />}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                    <div className="flex-shrink-0 flex items-center">
                                        <div className="relative h-8 w-8">
                                            <Image
                                                alt="statsifyLogo"
                                                draggable={false}
                                                src="/images/logo.png"
                                                layout="fill"
                                            />
                                        </div>
                                        <h1 className="text-white font-proximaNova hidden sm:block text-2xl font-bold ml-2">
                                            Statsify
                                        </h1>
                                    </div>
                                    <div className="hidden sm:block sm:ml-6">
                                        <div className="flex space-x-4">
                                            {navigation.map(item => (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? "bg-[#303030] text-white"
                                                            : "text-gray-300 hover:bg-[#404040] hover:text-white",
                                                        "px-3 py-2 rounded-md text-sm font-medium ease-in-out duration-100"
                                                    )}
                                                    aria-current={item.current ? "page" : undefined}
                                                >
                                                    {item.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 font-metropolis">
                                    <Menu as="div" className="ml-3 relative z-50">
                                        <div>
                                            <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#606060]">
                                                <span className="sr-only">Open user menu</span>
                                                <div className="relative h-9 w-9 rounded-full overflow-hidden">
                                                    <Image alt="user-pfp" src={data.images[0].url} layout="fill" />
                                                </div>
                                            </Menu.Button>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#303030] ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="px-1 py-1 ">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <Link href="/privacy">
                                                                <a
                                                                    className="hover:bg-[#505050] transition-all ease-in-out duration-100
                                                                    group flex w-full items-center rounded-md px-2 py-2 text-sm text-white"
                                                                >
                                                                    Privacy Policy
                                                                </a>
                                                            </Link>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="https://spotify.com/us/account/apps"
                                                                className="hover:bg-[#505050] transition-all ease-in-out duration-100
                                                                group flex w-full items-center rounded-md px-2 py-2 text-sm text-white"
                                                            >
                                                                Remove Account
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="https://spotify.com/logout"
                                                                className="hover:bg-[#505050] transition-all ease-in-out duration-100
                                                                group flex w-full items-center rounded-md px-2 py-2 text-sm text-white"
                                                            >
                                                                Sign Out
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 font-metropolis">
                                {navigation.map(item => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? "bg-[#303030] text-white"
                                                : "text-gray-300 hover:bg-[#404040] hover:text-white",
                                            "block px-3 py-2 rounded-md text-base font-medium ease-in-out duration-100"
                                        )}
                                        aria-current={item.current ? "page" : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        );
    };

    const MainNavigation = () => {
        return (
            <div className="flex-1 flex flex-col w-[280px] h-[100vh] fixed bg-mgray font-metropolis">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                    <div className="px-5">
                        <Link href="/">
                            <a className="flex items-center flex-shrink-0">
                                <div className="relative h-[38px] w-[38px]">
                                    <Image alt="statsifyLogo" draggable={false} src="/images/logo.png" layout="fill" />
                                </div>
                                <h1 className="text-white font-proximaNova text-2xl font-bold ml-2">Statsify</h1>
                            </a>
                        </Link>
                    </div>
                    <nav className="mt-5 flex-1 px-4 bg-mgray space-y-1" aria-label="Sidebar">
                        {navigation.map(item => (
                            <Link href={item.href} key={item.name}>
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        item.current
                                            ? "bg-[#303030] text-white"
                                            : "text-gray-300 hover:bg-[#404040] hover:text-white",
                                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md ease-in-out duration-100"
                                    )}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className={classNames(
                                            item.current ? "text-gray-300" : "text-gray-400 group-hover:text-gray-300",
                                            "mr-3 flex-shrink-0 h-6 w-6"
                                        )}
                                        aria-hidden="true"
                                    />
                                    <span className="flex-1">{item.name}</span>
                                    {item.count ? (
                                        <span
                                            className={classNames(
                                                item.current ? "bg-gray-800" : "bg-gray-900 group-hover:bg-gray-800",
                                                "ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full"
                                            )}
                                        >
                                            {item.count}
                                        </span>
                                    ) : null}
                                </a>
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex-shrink-0 flex bg-[#303030] p-4">
                    <Menu>
                        <Menu.Button className="flex-shrink-0 w-full group block">
                            <div className="flex items-center">
                                <div className="relative h-9 w-9 rounded-full overflow-hidden">
                                    <Image alt="user-pfp" src={data.images[0].url} layout="fill" />
                                </div>
                                <div className="ml-3 flex items-center">
                                    <p className="text-sm font-medium text-white">{data.display_name}</p>
                                    <svg
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        height="1em"
                                        className="text-white ml-1 h-[18px] min-w-[18px] rotate-[270deg]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute bottom-16 mt-2 w-56 origin-bottom-left divide-y divide-gray-100 rounded-md bg-[#404040] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link href="/privacy">
                                                <a
                                                    className="hover:bg-[#505050] transition-all ease-in-out duration-100
                                                group flex w-full items-center rounded-md px-2 py-2 text-sm text-white"
                                                >
                                                    Privacy Policy
                                                </a>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="https://spotify.com/us/account/apps"
                                                className="hover:bg-[#505050] transition-all ease-in-out duration-100
                                            group flex w-full items-center rounded-md px-2 py-2 text-sm text-white"
                                            >
                                                Remove Account
                                            </a>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <a
                                                href="https://spotify.com/logout"
                                                className="hover:bg-[#505050] transition-all ease-in-out duration-100
                                            group flex w-full items-center rounded-md px-2 py-2 text-sm text-white"
                                            >
                                                Sign Out
                                            </a>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>
        );
    };

    return <>{isBreakpoint ? <MainNavigation /> : <MobileNavigation />}</>;
};
