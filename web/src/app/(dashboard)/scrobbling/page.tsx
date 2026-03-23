"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Cog6ToothIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

type StatType = "tracks" | "artists" | "albums" | "contexts";

interface BaseStat {
	_id: string;
	play_count: number;
	total_duration_ms: number;
}

interface TrackStat extends BaseStat {
	track_name: string;
	artist_name: string;
}
interface ArtistStat extends BaseStat {
	artist_name: string;
}
interface AlbumStat extends BaseStat {
	album_name: string;
	artist_name: string;
}
interface ContextStat extends BaseStat {
	context_name: string;
	context_type: string;
}

export default function ScrobblingDashboard() {
	const [activeTab, setActiveTab] = useState<StatType>("tracks");

	const { data, error, isLoading, mutate } = useSWR(`/retrievify/spotify/stats/${activeTab}?limit=15`, fetcher);

	const stats = data?.data || [];

	const chartData = stats.map((stat: any) => ({
		...stat,
		displayName:
			activeTab === "tracks"
				? stat.track_name
				: activeTab === "artists"
					? stat.artist_name
					: activeTab === "albums"
						? stat.album_name
						: stat.context_type,
	}));

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-[var(--color-mgray)] border border-white/10 p-4 rounded-xl shadow-2xl">
					<p className="font-bold text-white mb-1">{payload[0].payload.displayName}</p>
					<p className="text-[var(--color-primary)] font-bold">
						{payload[0].value} Plays
					</p>
					<p className="text-gray-400 text-sm mt-1">
						{Math.round(payload[0].payload.total_duration_ms / 60000)} mins listened
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
				<div>
					<h1 className="text-4xl font-metropolis font-bold">Scrobbler Analytics</h1>
					<p className="text-gray-400 mt-2">
						Immutable listening history powered by your Mai cluster.
					</p>
				</div>

				<div className="flex items-center space-x-3">
					<button
						onClick={() => mutate()}
						disabled={isLoading}
						className="p-3 bg-[var(--color-mgray)] border border-white/10 rounded-xl hover:bg-white/5 transition-colors group"
						title="Force Refresh"
					>
						<ArrowPathIcon
							className={`w-5 h-5 text-gray-300 ${isLoading ? "animate-spin" : "group-hover:text-white"}`}
						/>
					</button>
					<Link
						href="/scrobbling/setup"
						className="flex items-center space-x-2 px-6 py-3 bg-[var(--color-mgray)] border border-white/10 rounded-xl hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all font-bold text-sm uppercase tracking-wider"
					>
						<Cog6ToothIcon className="w-5 h-5" />
						<span>Configure Engine</span>
					</Link>
				</div>
			</header>

			<div className="flex space-x-2 bg-[var(--color-mgray)] p-1 rounded-xl border border-white/10 w-fit">
				{(["tracks", "artists", "albums", "contexts"] as StatType[]).map(tab => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-6 py-2 rounded-lg font-bold capitalize transition-all ${
							activeTab === tab
								? "bg-[var(--color-primary)] text-black shadow-md"
								: "text-gray-400 hover:text-white hover:bg-white/5"
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			{error ? (
				<div className="p-8 text-center border border-red-500/20 bg-red-500/10 rounded-2xl">
					<p className="text-red-400 font-bold">Failed to connect to the Mai cluster.</p>
					<p className="text-sm text-red-400/80 mt-2">
						Ensure your Go daemon is running and your database is accessible.
					</p>
				</div>
			) : isLoading && !data ? (
				<div className="h-96 flex items-center justify-center border border-white/5 rounded-2xl bg-white/5 animate-pulse">
					<div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
				</div>
			) : stats.length === 0 ? (
				<div className="h-96 flex flex-col items-center justify-center border border-dashed border-white/20 rounded-2xl bg-white/5 text-center p-8">
					<div className="w-16 h-16 bg-[var(--color-mgray)] rounded-full flex items-center justify-center mb-4 border border-white/10">
						<Cog6ToothIcon className="w-8 h-8 text-gray-500" />
					</div>
					<h3 className="text-2xl font-bold mb-2">No Data Found</h3>
					<p className="text-gray-400 max-w-md">
						Your daemon hasn't scrobbled any songs yet, or you haven't configured
						your BYOK keys.
					</p>
					<Link
						href="/scrobbling/setup"
						className="mt-6 text-[var(--color-primary)] font-bold hover:underline"
					>
						Initialize Engine Now →
					</Link>
				</div>
			) : (
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					<div className="xl:col-span-2 bg-[var(--color-mgray)] border border-white/10 rounded-2xl p-6 shadow-2xl">
						<h2 className="text-xl font-bold mb-6 capitalize border-l-4 border-[var(--color-primary)] pl-3">
							Top {activeTab} by Play Count
						</h2>
						<div className="h-80 w-full">
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
										tickFormatter={value =>
											value.length > 12
												? `${value.substring(0, 12)}...`
												: value
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
									<Bar dataKey="play_count" radius={[4, 4, 0, 0]}>
										{chartData.map(
											(entry: any, index: number) => (
												<Cell
													key={`cell-${index}`}
													fill={
														index ===
														0
															? "var(--color-primary)"
															: "#333"
													}
												/>
											),
										)}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* The Raw Data List */}
					<div className="bg-[var(--color-mgray)] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full">
						<h2 className="text-xl font-bold mb-4">Raw Ledger</h2>
						<ul className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
							{chartData.map((stat: any, index: number) => (
								<li
									key={stat._id}
									className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
								>
									<div className="flex items-center space-x-4 overflow-hidden">
										<span
											className={`font-bold w-5 text-center ${index === 0 ? "text-[var(--color-primary)]" : "text-gray-600"}`}
										>
											{index + 1}
										</span>
										<div className="truncate">
											<p className="font-bold text-sm text-white truncate">
												{stat.displayName}
											</p>
											{activeTab === "tracks" && (
												<p className="text-xs text-gray-500 truncate">
													{
														stat.artist_name
													}
												</p>
											)}
										</div>
									</div>
									<div className="text-right pl-4">
										<p className="text-sm font-bold text-white">
											{stat.play_count}
										</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
