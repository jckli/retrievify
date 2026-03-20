import { useState, useMemo } from "react";
import useSWR from "swr";
import { Dropdown } from "@/components/Dropdown";
import { ObscureChart } from "@/components/Home/ObsChart";

const basicFetcher = (url: string) => fetch(url).then(res => res.json());

const countryOptions = [
	{ id: "US", value: "US", label: "United States" },
	{ id: "AR", value: "AR", label: "Argentina" },
	{ id: "AU", value: "AU", label: "Australia" },
	{ id: "BE", value: "BE", label: "Belgium" },
	{ id: "BR", value: "BR", label: "Brazil" },
	{ id: "CL", value: "CL", label: "Chile" },
	{ id: "DK", value: "DK", label: "Denmark" },
	{ id: "FI", value: "FI", label: "Finland" },
	{ id: "FR", value: "FR", label: "France" },
	{ id: "DE", value: "DE", label: "Germany" },
	{ id: "GB", value: "GB", label: "Great Britain" },
	{ id: "HU", value: "HU", label: "Hungary" },
	{ id: "IN", value: "IN", label: "India" },
	{ id: "ID", value: "ID", label: "Indonesia" },
	{ id: "IE", value: "IE", label: "Ireland" },
	{ id: "IT", value: "IT", label: "Italy" },
	{ id: "MX", value: "MX", label: "Mexico" },
	{ id: "MY", value: "MY", label: "Malaysia" },
	{ id: "NL", value: "NL", label: "Netherlands" },
	{ id: "NZ", value: "NZ", label: "New Zealand" },
	{ id: "NO", value: "NO", label: "Norway" },
	{ id: "PH", value: "PH", label: "Philippines" },
	{ id: "PL", value: "PL", label: "Poland" },
	{ id: "PT", value: "PT", label: "Portugal" },
	{ id: "ES", value: "ES", label: "Spain" },
	{ id: "SG", value: "SG", label: "Singapore" },
	{ id: "SE", value: "SE", label: "Sweden" },
	{ id: "TR", value: "TR", label: "Turkey" },
	{ id: "VN", value: "VN", label: "Vietnam" },
];

export const ObscurifyStats = ({ taShort, taLong }: { taShort: any; taLong: any }) => {
	const [country, setCountry] = useState("US");

	const scores = useMemo(() => {
		const calcObs = (items: any[]) =>
			Math.floor(
				items.reduce(
					(sum, item, i) =>
						sum +
						(50 / items.length) *
							Math.floor(item.popularity * (1 - i / items.length)),
					0,
				) / 10,
			);
		return { recent: calcObs(taShort?.items || []), all_time: calcObs(taLong?.items || []) };
	}, [taShort, taLong]);

	const { data: obsc } = useSWR(
		`https://ktp0b5os1g.execute-api.us-east-2.amazonaws.com/dev/getObscurifyData?code=${country}&obscurifyScore=${scores.all_time}&recentObscurifyScore=${scores.recent}`,
		basicFetcher,
	);

	return (
		<div className="bg-mgray rounded-md p-5">
			<div className="flex items-center justify-between sm:justify-start gap-4">
				<h1 className="font-proximaNova text-3xl">Obscurify Data</h1>
				<Dropdown
					items={countryOptions}
					initialActiveId={country}
					onChange={setCountry}
					align="responsive"
				/>
			</div>
			<div className="mt-4 flex flex-col sm:flex-row justify-between gap-4 mlg:gap-10 mlg:mx-10">
				{["Recent", "All Time"].map((label, i) => {
					const percent = obsc
						? i === 0
							? obsc.percentileByCountryRecent
							: obsc.percentileByCountryAllTime
						: 0;
					return (
						<div key={label} className="bg-[#303030] rounded-md w-full p-5">
							<h1 className="font-proximaNova text-2xl">{label}</h1>
							<div className="mt-2">
								<p className="mt-1 text-xl">
									{obsc
										? `${Math.floor(percent)}% of ${obsc.userCountByCountry.toLocaleString()}`
										: "Loading..."}
								</p>
								<p className="mt-1 text-sm text-gray-400">
									More Obscure
								</p>
							</div>
						</div>
					);
				})}
			</div>
			<div className="mt-4 flex flex-col items-center">
				<h1 className="font-proximaNova text-2xl mb-2">Country Distribution Graph</h1>
				{obsc && <ObscureChart data={obsc} />}
			</div>
		</div>
	);
};
