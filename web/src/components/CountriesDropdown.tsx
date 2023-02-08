import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export const CountriesDropdown = (props: any) => {
    const [buttonText, setButtonText] = useState("United States");
    const [active, setActive] = useState(1);

    const handleClick = (id: number, country: string, text: string) => {
        props.setCountry(country);
        setActive(id);
        setButtonText(text);
    };

    const items = [
        { id: 1, country: "US", text: "United States" },
        { id: 2, country: "AR", text: "Argentina" },
        { id: 3, country: "AU", text: "Australia" },
        { id: 4, country: "BE", text: "Belgium" },
        { id: 5, country: "BR", text: "Brazil" },
        { id: 6, country: "CL", text: "Chile" },
        { id: 7, country: "DK", text: "Denmark" },
        { id: 8, country: "FI", text: "Finland" },
        { id: 9, country: "FR", text: "France" },
        { id: 10, country: "DE", text: "Germany" },
        { id: 11, country: "GB", text: "Great Britain" },
        { id: 12, country: "HU", text: "Hungary" },
        { id: 13, country: "IN", text: "India" },
        { id: 14, country: "ID", text: "Indonesia" },
        { id: 15, country: "IE", text: "Ireland" },
        { id: 16, country: "IT", text: "Italy" },
        { id: 17, country: "MX", text: "Mexico" },
        { id: 18, country: "MY", text: "Malaysia" },
        { id: 19, country: "NL", text: "Netherlands" },
        { id: 20, country: "NZ", text: "New Zealand" },
        { id: 21, country: "NO", text: "Norway" },
        { id: 22, country: "PH", text: "Philippines" },
        { id: 23, country: "PL", text: "Poland" },
        { id: 24, country: "PT", text: "Portugal" },
        { id: 25, country: "ES", text: "Spain" },
        { id: 26, country: "SG", text: "Singapore" },
        { id: 26, country: "SE", text: "Sweden" },
        { id: 27, country: "TR", text: "Turkey" },
        { id: 28, country: "VN", text: "Vietnam" },
    ];

    let direction = "sm:left-0 sm:origin-top-left";
    if (props.fromDirection === "right") {
        direction = "sm:right-0 sm:origin-top-right";
    }
    return (
        <Menu as="div" className="relative inline-block text-left z-50">
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
                    className={`
                    absolute right-0 origin-top-right ${direction} mt-2 w-56 divide-gray-100 rounded-md bg-[#303030] shadow-lg ring-1 ring-black 
                    ring-opacity-10 focus:outline-none font-lexend max-h-[150px] overflow-y-auto
                    `}
                >
                    <div className="px-1 py-1 ">
                        {items.map((item: any) => (
                            <Menu.Item key={item.id}>
                                <button
                                    onClick={() => {
                                        handleClick(item.id, item.country, item.text);
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
