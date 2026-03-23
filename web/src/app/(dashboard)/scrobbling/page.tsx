"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Cog6ToothIcon, ArrowPathIcon, PlayIcon } from "@heroicons/react/24/outline";

type StatType = "tracks" | "artists" | "albums" | "contexts";

interface BaseStat {
	_id: string;
	play_count: number;
	total_duration_ms: number;
}

export default function ScrobblingDashboard() {
	const [activeTab, setActiveTab] = useState<StatType>("tracks");

	const { data: statusData, isLoading: statusLoading } = useSWR("/retrievify/spotify/scrobbler-status", fetcher);
	const isSetup = statusData?.setup === true;

	const {
		data: statsData,
		error: statsError,
		isLoading: statsLoading,
		mutate,
	} = useSWR(isSetup ? `/retrievify/spotify/stats/${activeTab}?limit=15` : null, fetcher);

	const stats = statsData?.data || [];

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

	if (statusLoading) {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
				<div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
				<p className="text-gray-500 font-metropolis font-bold animate-pulse">
					Waking up Mai cluster...
				</p>
			</div>
		);
	}

	if (!isSetup) {
		return (
			<div className="p-4 md:p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
				<div className="bg-[var(--color-mgray)] border border-white/10 rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />

					<div className="w-20 h-20 bg-black/50 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(74,211,255,0.1)]">
						<Cog6ToothIcon className="w-10 h-10 text-[var(--color-primary)]" />
					</div>

					<h1 className="text-4xl md:text-5xl font-metropolis font-bold mb-6">
						Initialize the Engine
					</h1>
					<p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
						To completely bypass Spotify's tracking limits and own your data,
						Retrievify uses a Bring-Your-Own-Keys (BYOK) architecture. You need to
						configure your background daemon before viewing analytics.
					</p>

					<Link
						href="/scrobbling/setup"
						className="inline-flex items-center space-x-3 bg-[var(--color-primary)] text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(74,211,255,0.4)] transition-all"
					>
						<span>Begin Setup Wizard</span>
						<PlayIcon className="w-5 h-5" />
					</Link>
				</div>
			</div>
		);
	}

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
						disabled={statsLoading}
						className="p-3 bg-[var(--color-mgray)] border border-white/10 rounded-xl hover:bg-white/5 transition-colors group"
						title="Force Refresh"
					>
						<ArrowPathIcon
							className={`w-5 h-5 text-gray-300 ${statsLoading ? "animate-spin" : "group-hover:text-white"}`}
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

			{statsError ? (
				<div className="p-8 text-center border border-red-500/20 bg-red-500/10 rounded-2xl">
					<p className="text-red-400 font-bold">Failed to connect to the Mai cluster.</p>
					<p className="text-sm text-red-400/80 mt-2">
						Ensure your Go daemon is running and your database is accessible.
					</p>
				</div>
			) : statsLoading && !statsData ? (
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
						Your daemon hasn't scrobbled any songs yet, or you haven't played
						anything since configuring your keys.
					</p>
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

					<div className="bg-[var(--color-mgray)] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-full max-h-[420px]">
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
