import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export const PackagePDropdown = (props: any) => {
    const [buttonText, setButtonText] = useState("Package");
    const [active, setActive] = useState(1);

    const handleClick = (id: number, period: string, text: string) => {
        props.setPeriod(period);
        setActive(id);
        setButtonText(text);
    };

    const items = [
        { id: 1, period: "package", text: "Package" },
        { id: 2, period: "year", text: "Year" },
    ];
    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-2 rounded-md ease-in-out duration-200 transition-all bg-[#303030] hover:bg-[#404040] flex items-center">
                {buttonText}
                <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    height="1em"
                    className="ml-1 h-[18px] min-w-[18px] rotate-90"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
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
                <Menu.Items
                    className="
                    absolute right-0 origin-top-right sm:left-0 sm:origin-top-left mt-2 w-56 divide-gray-100 rounded-md bg-[#303030] shadow-lg ring-1 ring-black 
                    ring-opacity-10 focus:outline-none font-lexend
                    "
                >
                    <div className="px-1 py-1 ">
                        {items.map((item: any) => (
                            <Menu.Item key={item.id}>
                                <button
                                    onClick={() => {
                                        handleClick(item.id, item.period, item.text);
                                    }}
                                    className={`${
                                        active === item.id
                                            ? "bg-[#252525] text-white "
                                            : "text-white hover:bg-[#404040] hover:text-white ease-in-out duration-100"
                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm 
                                    `}
                                >
                                    {item.text}
                                </button>
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
