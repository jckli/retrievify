import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useState } from "react";

export type DropdownItem = { id: string | number; value: string; label: string };

export const Dropdown = ({
	items,
	initialActiveId,
	onChange,
}: {
	items: DropdownItem[];
	initialActiveId: string | number;
	onChange: (value: string) => void;
}) => {
	const [active, setActive] = useState(items.find(i => i.id === initialActiveId) || items[0]);

	const handleClick = (item: DropdownItem) => {
		setActive(item);
		onChange(item.value);
	};

	return (
		<Menu as="div" className="relative inline-block text-left z-50">
			<MenuButton className="p-2 rounded-md transition-all duration-200 bg-[#303030] hover:bg-[#404040] flex items-center text-white cursor-pointer">
				{active.label}
				<svg
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					className="ml-1 h-[18px] w-[18px] rotate-90"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</MenuButton>

			<MenuItems
				transition
				className="absolute left-0 origin-top-left mt-2 w-56 rounded-md bg-[#303030] shadow-lg ring-1 ring-black/10 focus:outline-none p-1 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 max-h-60 overflow-y-auto"
			>
				{items.map(item => (
					<MenuItem key={item.id}>
						<button
							onClick={() => handleClick(item)}
							className={`group flex w-full items-center rounded-md px-2 py-2 text-sm transition-all duration-100 ${
								active.id === item.id
									? "bg-[#252525] text-white"
									: "text-white data-[focus]:bg-[#404040]"
							}`}
						>
							{item.label}
						</button>
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
};
