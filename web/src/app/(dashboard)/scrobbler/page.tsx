"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Cog6ToothIcon, ArrowPathIcon, PlayIcon } from "@heroicons/react/24/outline";

type StatType = "tracks" | "artists" | "albums";
type TimeRange = "allTime" | "thisMonth";

export default function ScrobblerDashboard() {
	const [tab, setTab] = useState<StatType>("tracks");
	const [range, setRange] = useState<TimeRange>("allTime");

	const { data: statusData, isLoading: statusLoading } = useSWR("/retrievify/spotify/scrobbler/status", fetcher);
	const isSetup = statusData?.setup === true;

	const endpoint = range === "allTime" ? "stats" : "history";
	const {
		data: dbData,
		error: dbError,
		isLoading: dbLoading,
		mutate,
	} = useSWR(isSetup ? `/retrievify/spotify/scrobbler/${endpoint}?type=${tab}&limit=15` : null, fetcher);

	const rawStats = dbData?.data || [];
	const ids = rawStats
		.map((s: any) => s.spotify_id)
		.filter(Boolean)
		.join(",");

	const { data: spotData, isLoading: spotLoading } = useSWR(
		ids ? `/retrievify/spotify/${tab}?ids=${ids}` : null,
		fetcher,
	);

	const chartData = useMemo(() => {
		if (!spotData) return [];
		const spotItems = spotData[tab] || [];
		const spotMap = new Map(spotItems.map((i: any) => [i.id, i]));

		return rawStats.map((stat: any) => {
			const item: any = spotMap.get(stat.spotify_id) || {};
			return {
				...stat,
				displayName: item.name || "Unknown",
				subtext: tab === "artists" ? "Artist" : item.artists?.[0]?.name || "Unknown",
				imageUrl: tab === "tracks" ? item.album?.images?.[0]?.url : item.images?.[0]?.url,
			};
		});
	}, [rawStats, spotData, tab]);

	const isLoading = dbLoading || (rawStats.length > 0 && spotLoading);

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const d = payload[0].payload;
			return (
				<div className="bg-[var(--color-mgray)] border border-white/10 p-4 rounded-xl flex items-center space-x-4">
					<img
						src={d.imageUrl || "/images/logo.png"}
						alt=""
						className="w-12 h-12 rounded-md object-cover"
					/>
					<div>
						<p className="font-bold text-white mb-1">{d.displayName}</p>
						<p className="text-[var(--color-primary)] font-bold">
							{payload[0].value} Plays
						</p>
					</div>
				</div>
			);
		}
		return null;
	};

	if (statusLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Checking status...</div>;

	if (!isSetup)
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in p-4 md:p-8">
				<div className="bg-[var(--color-mgray)] border border-white/10 rounded-3xl p-10 text-center shadow-2xl max-w-2xl w-full">
					<Cog6ToothIcon className="w-16 h-16 mx-auto text-[var(--color-primary)] mb-6" />
					<h1 className="text-4xl font-metropolis font-bold mb-4">
						Setup scrobbling for Retrievify
					</h1>
					<p className="text-gray-400 mb-8">
						Setup Retrievify to scrobble your listening data.
					</p>
					<Link
						href="/scrobbler/setup"
						className="inline-flex items-center space-x-3 bg-[var(--color-primary)] text-black px-8 py-4 rounded-full font-bold cursor-pointer"
					>
						<span>Begin Setup</span>
						<PlayIcon className="w-5 h-5" />
					</Link>
				</div>
			</div>
		);

	return (
		<div className="space-y-6 animate-in fade-in p-4 md:p-8 max-w-7xl mx-auto">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
				<div>
					<h1 className="text-4xl font-metropolis font-bold">Scrobbler Analytics</h1>
					<p className="text-gray-400 mt-1">Your Spotify listening history analysis</p>
				</div>
				<div className="flex space-x-3">
					<button
						onClick={() => mutate()}
						className="p-3 bg-[var(--color-mgray)] rounded-xl border border-white/10 cursor-pointer hover:bg-white/5 transition-colors"
					>
						<ArrowPathIcon className="w-5 h-5 text-gray-300" />
					</button>
					<Link
						href="/scrobbler/setup"
						className="flex items-center px-6 py-3 bg-[var(--color-mgray)] rounded-xl border border-white/10 text-sm font-bold cursor-pointer hover:bg-white/5 transition-colors"
					>
						<Cog6ToothIcon className="w-5 h-5 mr-2" /> Configure
					</Link>
				</div>
			</header>

			<div className="flex flex-wrap gap-4 justify-between items-center">
				<div className="flex space-x-2 bg-[var(--color-mgray)] p-1 rounded-xl border border-white/10">
					{(["tracks", "artists", "albums"] as StatType[]).map(t => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={`px-6 py-2 rounded-lg font-bold capitalize cursor-pointer transition-colors ${tab === t ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
						>
							{t}
						</button>
					))}
				</div>
				<div className="flex space-x-2 bg-[var(--color-mgray)] p-1 rounded-xl border border-white/10">
					<button
						onClick={() => setRange("thisMonth")}
						className={`px-6 py-2 rounded-lg font-bold cursor-pointer transition-colors ${range === "thisMonth" ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
					>
						This Month
					</button>
					<button
						onClick={() => setRange("allTime")}
						className={`px-6 py-2 rounded-lg font-bold cursor-pointer transition-colors ${range === "allTime" ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
					>
						All Time
					</button>
				</div>
			</div>

			{dbError ? (
				<div className="p-8 text-center bg-red-500/10 text-red-400 rounded-2xl font-bold">
					Failed to fetch data.
				</div>
			) : isLoading ? (
				<div className="h-96 flex flex-col items-center justify-center bg-[var(--color-mgray)] rounded-2xl animate-pulse">
					<div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
					<p className="text-gray-400 font-bold">Grabbing scrobbling data...</p>
				</div>
			) : chartData.length === 0 ? (
				<div className="h-96 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-gray-400 font-bold">
					No data found.
				</div>
			) : (
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<div className="xl:col-span-2 bg-[var(--color-mgray)] border border-white/10 rounded-2xl p-6 h-[450px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={chartData}
								margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
							>
								<XAxis
									dataKey="displayName"
									stroke="#555"
									tick={{ fill: "#888", fontSize: 12 }}
									tickLine={false}
									axisLine={false}
									tickFormatter={v =>
										v.length > 12
											? v.substring(0, 12) + "..."
											: v
									}
								/>
								<YAxis
									stroke="#555"
									tick={{ fill: "#888", fontSize: 12 }}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip
									cursor={{ fill: "rgba(255,255,255,0.05)" }}
									content={<CustomTooltip />}
								/>
								<Bar dataKey="play_count" radius={[6, 6, 0, 0]}>
									{chartData.map((e: any, i: number) => (
										<Cell
											key={i}
											fill={
												i === 0
													? "var(--color-primary)"
													: "#333"
											}
											className="transition-all duration-300 hover:opacity-80 cursor-pointer"
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className="bg-[var(--color-mgray)] border border-white/10 rounded-2xl p-6 flex flex-col h-[450px]">
						<h2 className="text-xl font-metropolis font-bold mb-4">Ledger</h2>
						<ul className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
							{chartData.map((s: any, i: number) => (
								<li
									key={i}
									className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors"
								>
									<div className="flex items-center space-x-3 overflow-hidden">
										<span
											className={`w-4 font-bold text-center ${i === 0 ? "text-[var(--color-primary)]" : "text-gray-500"}`}
										>
											{i + 1}
										</span>
										<img
											src={
												s.imageUrl ||
												"/images/logo.png"
											}
											className="w-10 h-10 rounded-lg object-cover"
											alt=""
										/>
										<div className="truncate">
											<p className="font-bold text-sm text-white truncate">
												{s.displayName}
											</p>
											<p className="text-xs text-gray-400 truncate">
												{s.subtext}
											</p>
										</div>
									</div>
									<span className="font-bold text-white text-sm pl-2">
										{s.play_count}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
