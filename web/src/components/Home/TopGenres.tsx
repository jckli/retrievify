import { useState, useMemo } from "react";
import { Dropdown } from "@/components/Dropdown";

const terms = ["short_term", "medium_term", "long_term"] as const;
const periodOptions = [
	{ id: "short_term", value: "short_term", label: "Last 4 Weeks" },
	{ id: "medium_term", value: "medium_term", label: "Last 6 Months" },
	{ id: "long_term", value: "long_term", label: "All Time" },
];

export const TopGenres = ({ topArtists }: { topArtists: any }) => {
	const [period, setPeriod] = useState("short_term");

	const genres = useMemo(() => {
		const computed: any = {};
		terms.forEach(term => {
			const counts: Record<string, number> = {};
			topArtists[term]?.items?.forEach((a: any) => {
				a.genres?.forEach((g: string) => (counts[g] = (counts[g] || 0) + 1));
			});
			computed[term] = Object.keys(counts)
				.sort((a, b) => counts[b] - counts[a])
				.slice(0, 10);
		});
		return computed;
	}, [topArtists]);

	return (
		<div className="bg-mgray rounded-md p-5">
			<div className="flex items-center justify-between sm:justify-start gap-4">
				<h1 className="font-proximaNova text-3xl">Top Genres</h1>
				<Dropdown items={periodOptions} initialActiveId={period} onChange={setPeriod} />
			</div>
			<div className="mt-4 flex flex-wrap gap-3">
				{genres[period].map((genre: string, idx: number) => (
					<div key={idx} className="bg-[#404040] rounded-lg px-4 py-2">
						<h1 className="text-xl text-white">
							{idx + 1}. {genre}
						</h1>
					</div>
				))}
			</div>
		</div>
	);
};
