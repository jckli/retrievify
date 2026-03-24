"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
	Cog6ToothIcon,
	ArrowPathIcon,
	PlayIcon,
	ClockIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "@heroicons/react/24/outline";

type StatType = "tracks" | "artists" | "albums";
type TimeRange = "allTime" | "thisMonth" | "timeline";

export default function ScrobblerDashboard() {
	const [tab, setTab] = useState<StatType>("tracks");
	const [range, setRange] = useState<TimeRange>("allTime");
	const [page, setPage] = useState(1);

	const { data: statusData, isLoading: statusLoading } = useSWR("/retrievify/spotify/scrobbler/status", fetcher);
	const isSetup = statusData?.setup === true;

	const endpoint =
		range === "allTime"
			? `stats?type=${tab}&limit=15`
			: range === "thisMonth"
				? `history?type=${tab}&limit=15`
				: `timeline?page=${page}&limit=50`;

	const {
		data: dbData,
		error: dbError,
		isLoading: dbLoading,
		mutate,
	} = useSWR(isSetup ? `/retrievify/spotify/scrobbler/${endpoint}` : null, fetcher);

	const rawStats = dbData?.data || [];
	const ids = rawStats
		.map((s: any) => s.spotify_id || s.track_id)
		.filter(Boolean)
		.join(",");

	const { data: spotData, isLoading: spotLoading } = useSWR(
		ids && range !== "timeline"
			? `/retrievify/spotify/${tab}?ids=${ids}`
			: ids && range === "timeline"
				? `/retrievify/spotify/tracks?ids=${Array.from(new Set(rawStats.map((s: any) => s.track_id))).join(",")}`
				: null,
		fetcher,
	);

	const chartData = useMemo(() => {
		if (!spotData && rawStats.length > 0 && !spotLoading) return rawStats;
		if (!spotData) return [];

		const spotItems = spotData[range === "timeline" ? "tracks" : tab] || [];
		const spotMap = new Map(spotItems.map((i: any) => [i.id, i]));

		return rawStats.map((stat: any) => {
			const id = stat.spotify_id || stat.track_id;
			const item: any = spotMap.get(id) || {};
			return {
				...stat,
				displayName: item.name || "Unknown",
				subtext:
					tab === "artists" && range !== "timeline"
						? "Artist"
						: item.artists?.[0]?.name || "Unknown",
				imageUrl:
					tab === "tracks" || range === "timeline"
						? item.album?.images?.[0]?.url
						: item.images?.[0]?.url,
			};
		});
	}, [rawStats, spotData, tab, range, spotLoading]);

	const isLoading = dbLoading || (rawStats.length > 0 && spotLoading);
	const isTimeline = range === "timeline";

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const d = payload[0].payload;
			return (
				<div className="bg-[var(--color-mgray)] border border-white/10 p-4 rounded-xl shadow-2xl flex items-center space-x-4">
					<img
						src={d.imageUrl || "/images/logo.png"}
						alt=""
						className="w-12 h-12 rounded-md object-cover"
					/>
					<div>
						<p className="font-bold text-white mb-1 font-metropolis">
							{d.displayName}
						</p>
						<p className="text-[var(--color-primary)] font-bold">
							{payload[0].value} Plays
						</p>
					</div>
				</div>
			);
		}
		return null;
	};

	if (statusLoading)
		return <div className="p-8 text-center text-gray-500 animate-pulse font-bold">Checking status...</div>;

	if (!isSetup)
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in p-4 md:p-8">
				<div className="bg-[var(--color-mgray)] border border-white/10 rounded-3xl p-10 md:p-16 text-center shadow-2xl max-w-2xl w-full">
					<Cog6ToothIcon className="w-16 h-16 mx-auto text-[var(--color-primary)] mb-6" />
					<h1 className="text-4xl font-metropolis font-bold mb-4">
						Setup scrobbling for Retrievify
					</h1>
					<p className="text-gray-400 mb-8 text-lg">
						Connect your keys to track and analyze your listening history.
					</p>
					<Link
						href="/scrobbler/setup"
						className="inline-flex items-center space-x-3 bg-[var(--color-primary)] text-black px-8 py-4 rounded-full font-bold cursor-pointer hover:scale-105 transition-transform"
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
					<p className="text-gray-400 mt-1">Your immutable listening history.</p>
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
							onClick={() => {
								setTab(t);
								setRange("allTime");
							}}
							className={`px-6 py-2 rounded-lg font-bold capitalize cursor-pointer transition-colors ${tab === t && !isTimeline ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
						>
							{t}
						</button>
					))}
				</div>
				<div className="flex space-x-2 bg-[var(--color-mgray)] p-1 rounded-xl border border-white/10">
					<button
						onClick={() => {
							setRange("timeline");
							setPage(1);
						}}
						className={`px-6 py-2 rounded-lg font-bold cursor-pointer transition-colors ${isTimeline ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
					>
						Timeline
					</button>
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
					No data found. Start playing music!
				</div>
			) : (
				<div
					className={`grid grid-cols-1 ${isTimeline ? "xl:grid-cols-1" : "xl:grid-cols-3"} gap-6`}
				>
					{!isTimeline && (
						<div className="xl:col-span-2 bg-[var(--color-mgray)] border border-white/10 rounded-2xl p-6 h-[500px] shadow-2xl">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={chartData}
									margin={{
										top: 10,
										right: 10,
										left: -20,
										bottom: 0,
									}}
								>
									<XAxis
										dataKey="displayName"
										stroke="#555"
										tick={{ fill: "#888", fontSize: 12 }}
										tickLine={false}
										axisLine={false}
										tickFormatter={v =>
											v?.length > 12
												? v.substring(0, 12) +
													"..."
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
										cursor={{
											fill: "rgba(255,255,255,0.05)",
										}}
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
					)}

					<div
						className={`bg-[var(--color-mgray)] border border-white/10 rounded-2xl p-6 flex flex-col ${isTimeline ? "h-[70vh]" : "h-[500px]"} shadow-2xl`}
					>
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-metropolis font-bold">Ledger</h2>
							{isTimeline && (
								<div className="flex space-x-2">
									<button
										disabled={page === 1}
										onClick={() => setPage(p => p - 1)}
										className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
									>
										<ChevronLeftIcon className="w-5 h-5 text-white" />
									</button>
									<button
										onClick={() => setPage(p => p + 1)}
										className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
									>
										<ChevronRightIcon className="w-5 h-5 text-white" />
									</button>
								</div>
							)}
						</div>
						<ul className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
							{chartData.map((s: any, i: number) => (
								<Link
									href={`/info/${isTimeline ? "track" : tab.slice(0, -1)}/${s.spotify_id || s.track_id}`}
									key={i}
								>
									<li className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-white/5">
										<div className="flex items-center space-x-4 overflow-hidden">
											<span
												className={`w-5 font-bold text-center ${i === 0 && !isTimeline ? "text-[var(--color-primary)]" : "text-gray-500"}`}
											>
												{isTimeline ? (
													<ClockIcon className="w-5 h-5 mx-auto" />
												) : (
													i + 1
												)}
											</span>
											<img
												src={
													s.imageUrl ||
													"/images/logo.png"
												}
												className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
												alt=""
											/>
											<div className="truncate">
												<p className="font-bold text-sm text-white truncate group-hover:text-[var(--color-primary)] transition-colors">
													{s.displayName}
												</p>
												<p className="text-xs text-gray-400 truncate mt-0.5">
													{isTimeline
														? new Date(
																s.played_at,
															).toLocaleString()
														: s.subtext}
												</p>
											</div>
										</div>
										{!isTimeline && (
											<div className="pl-4 text-right">
												<p className="text-sm font-bold text-white">
													{s.play_count}
												</p>
												<p className="text-[10px] text-gray-500 uppercase mt-0.5 tracking-wider">
													Plays
												</p>
											</div>
										)}
									</li>
								</Link>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
