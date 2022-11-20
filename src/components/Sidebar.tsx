import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBoxOpen, faB } from "@fortawesome/free-solid-svg-icons";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export const Sidebar = (props: any) => {
    var active = props.active;
    const navigation = [
        { name: "Home", icon: faHouse, href: "/home", count: 0, current: active == 1 },
        { name: "Data Package", icon: faBoxOpen, href: "/package", count: 0, current: active == 2 },
    ];

    const fetcher = (url: any) => fetch(url).then(r => r.json());
    const { data, error } = useSWR("/api/spotify/getuser", fetcher);
    if (!data || error) {
        return <div>error</div>;
    }
    return (
        <div className="flex-1 flex flex-col w-[280px] h-[100vh] fixed bg-mgray font-metropolis">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-5">
                    <div className="relative h-[38px] w-[38px]">
                        <Image alt="statsifyLogo" draggable={false} src="/images/logo.png" layout="fill" />
                    </div>
                    <h1 className="text-white font-proximaNova text-2xl font-bold ml-2">Statsify</h1>
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
                                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
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
                <a href="#" className="flex-shrink-0 w-full group block">
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
                </a>
            </div>
        </div>
    );
};
