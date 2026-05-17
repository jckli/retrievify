"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { fetcher } from "@/utils/fetcher";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faSync, faPlay, faClock, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import AdvancedInsights from "@/components/Scrobbler/AdvancedInsights";
import DeepLab from "@/components/Scrobbler/DeepLab";

type StatType = "tracks" | "artists" | "albums";
type TimeRange = "allTime" | "thisMonth";
type TabType = "history" | "overview" | "lab";

export default function ScrobblerDashboard() {
	const [activeTab, setActiveTab] = useState<TabType>("history");

	const [tab, setTab] = useState<StatType>("tracks");
	const [range, setRange] = useState<TimeRange>("allTime");
	const [page, setPage] = useState(1);

	const { data: statusData, isLoading: statusLoading } = useSWR("/retrievify/spotify/scrobbler/status", fetcher);
	const isSetup = statusData?.setup === true;

	const chartEndpoint = range === "allTime" ? `stats?type=${tab}&limit=15` : `history?type=${tab}&limit=15`;
	const {
		data: dbChartData,
		error: dbChartError,
		isLoading: dbChartLoading,
		mutate: mutateCharts,
	} = useSWR(isSetup ? `/retrievify/spotify/scrobbler/${chartEndpoint}` : null, fetcher);

	const topStats = dbChartData?.data || [];
	const topIds = topStats
		.map((s: any) => s.spotify_id)
		.filter(Boolean)
		.join(",");

	const { data: spotTopData, isLoading: spotTopLoading } = useSWR(
		topIds ? `/retrievify/spotify/${tab}?ids=${topIds}` : null,
		fetcher,
	);

	const {
		data: dbTimelineData,
		isLoading: dbTimelineLoading,
		mutate: mutateTimeline,
	} = useSWR(isSetup ? `/retrievify/spotify/scrobbler/timeline?page=${page}&limit=50` : null, fetcher);

	const timelineStats = dbTimelineData?.data || [];
	const hasNextPage = dbTimelineData?.has_next || false;
	const timelineIds = Array.from(new Set(timelineStats.map((s: any) => s.track_id)))
		.filter(Boolean)
		.join(",");

	const { data: spotTimelineData } = useSWR(
		timelineIds ? `/retrievify/spotify/tracks?ids=${timelineIds}` : null,
		fetcher,
	);

	const chartData = useMemo(() => {
		if (!spotTopData) return [];
		const spotItems = spotTopData[tab] || [];
		const spotMap = new Map(spotItems.map((i: any) => [i.id, i]));

		return topStats.map((stat: any) => {
			const item: any = spotMap.get(stat.spotify_id) || {};
			return {
				...stat,
				displayName: item.name || "Unknown",
				subtext: tab === "artists" ? "Artist" : item.artists?.[0]?.name || "Unknown",
				imageUrl: tab === "tracks" ? item.album?.images?.[0]?.url : item.images?.[0]?.url,
			};
		});
	}, [topStats, spotTopData, tab]);

	const recentData = useMemo(() => {
		if (!spotTimelineData) return [];
		const spotItems = spotTimelineData.tracks || [];
		const spotMap = new Map(spotItems.map((i: any) => [i.id, i]));

		return timelineStats.map((stat: any) => {
			const item: any = spotMap.get(stat.track_id) || {};
			return {
				...stat,
				displayName: item.name || "Unknown Track",
				subtext: item.artists?.map((a: any) => a.name).join(", ") || "Unknown Artist",
				imageUrl: item.album?.images?.[0]?.url || "/images/logo.png",
			};
		});
	}, [timelineStats, spotTimelineData]);

	const isChartLoading = dbChartLoading || (topStats.length > 0 && spotTopLoading);

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const d = payload[0].payload;
			return (
				<div className="bg-mgray border border-white/10 p-4 rounded-xl shadow-2xl flex items-center space-x-4 z-50">
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
		return (
			<div className="p-8 text-center text-gray-500 font-bold min-h-[70vh] flex items-center justify-center">
				Loading...
			</div>
		);

	if (!isSetup)
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in p-4 md:p-8">
				<div className="bg-mgray border border-white/10 rounded-3xl p-10 md:p-16 text-center shadow-2xl max-w-2xl w-full">
					<FontAwesomeIcon
						icon={faCog}
						className="text-6xl text-[var(--color-primary)] mb-6"
					/>
					<h1 className="text-4xl font-metropolis font-bold mb-4">
						Setup scrobbling for Retrievify
					</h1>
					<p className="text-gray-400 mb-8 text-lg font-proximaNova">
						Connect your keys to track and analyze your listening history.
					</p>
					<Link
						href="/scrobbler/setup"
						className="inline-flex items-center space-x-3 bg-[var(--color-primary)] text-black px-8 py-4 rounded-full font-bold cursor-pointer hover:scale-105 transition-transform"
					>
						<span>Begin Setup</span>
						<FontAwesomeIcon icon={faPlay} className="ml-1" />
					</Link>
				</div>
			</div>
		);

	return (
		<div className="space-y-8 animate-in fade-in p-4 md:p-8 max-w-7xl mx-auto w-full">
			<header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
				<div>
					<h1 className="text-4xl font-metropolis font-bold">Scrobbler Analytics</h1>
					<p className="text-gray-400 mt-1 font-proximaNova">
						Your immutable listening history.
					</p>
				</div>
				<div className="flex space-x-3">
					<button
						onClick={() => {
							mutateCharts();
							mutateTimeline();
						}}
						className="p-3 bg-mgray rounded-xl border border-white/10 cursor-pointer hover:bg-[#303030] transition-colors"
					>
						<FontAwesomeIcon icon={faSync} className="text-gray-300" />
					</button>
					<Link
						href="/scrobbler/setup"
						className="flex items-center px-6 py-3 bg-mgray rounded-xl border border-white/10 text-sm font-bold cursor-pointer hover:bg-[#303030] transition-colors font-metropolis"
					>
						<FontAwesomeIcon icon={faCog} className="mr-2" /> Configure
					</Link>
				</div>
			</header>

			<div className="flex space-x-2 bg-mgray p-1 rounded-xl border border-white/10 w-fit">
				<button
					onClick={() => setActiveTab("history")}
					className={`px-6 py-2 rounded-lg font-metropolis font-bold text-sm transition-all duration-200 ${
						activeTab === "history"
							? "bg-[var(--color-primary)] text-black shadow-md"
							: "text-gray-400 hover:text-white cursor-pointer"
					}`}
				>
					Timeline
				</button>
				<button
					onClick={() => setActiveTab("overview")}
					className={`px-6 py-2 rounded-lg font-metropolis font-bold text-sm transition-all duration-200 ${
						activeTab === "overview"
							? "bg-[var(--color-primary)] text-black shadow-md"
							: "text-gray-400 hover:text-white cursor-pointer"
					}`}
				>
					Overview
				</button>
				<button
					onClick={() => setActiveTab("lab")}
					className={`px-6 py-2 rounded-lg font-metropolis font-bold text-sm transition-all duration-200 ${
						activeTab === "lab"
							? "bg-[var(--color-primary)] text-black shadow-md"
							: "text-gray-400 hover:text-white cursor-pointer"
					}`}
				>
					Deep Lab
				</button>
			</div>

			<div className="w-full relative min-h-[60vh]">
				{activeTab === "history" && (
					<div className="space-y-10 animate-in fade-in duration-500">
						<div className="space-y-6">
							<div className="flex flex-wrap gap-4 justify-between items-center font-proximaNova">
								<div className="flex space-x-2 bg-mgray p-1 rounded-xl border border-white/10">
									{(
										[
											"tracks",
											"artists",
											"albums",
										] as StatType[]
									).map(t => (
										<button
											key={t}
											onClick={() => setTab(t)}
											className={`px-6 py-2 rounded-lg font-bold capitalize cursor-pointer transition-colors ${tab === t ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
										>
											{t}
										</button>
									))}
								</div>
								<div className="flex space-x-2 bg-mgray p-1 rounded-xl border border-white/10">
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

							{dbChartError ? (
								<div className="p-8 text-center bg-red-500/10 text-red-400 rounded-2xl font-bold font-proximaNova">
									Failed to fetch data.
								</div>
							) : isChartLoading ? (
								<div className="h-96 flex flex-col items-center justify-center bg-mgray rounded-2xl">
									<p className="text-gray-400 font-bold font-proximaNova">
										Loading charts...
									</p>
								</div>
							) : chartData.length === 0 ? (
								<div className="h-96 flex items-center justify-center border border-dashed border-white/10 rounded-2xl text-gray-400 font-bold font-proximaNova">
									No data found. Start playing music!
								</div>
							) : (
								<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
									<div className="xl:col-span-2 bg-mgray border border-white/10 rounded-2xl p-6 h-[500px]">
										<ResponsiveContainer
											width="100%"
											height="100%"
										>
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
													tick={{
														fill: "#888",
														fontSize: 12,
														fontFamily: "ProximaNova",
													}}
													tickLine={false}
													axisLine={false}
													tickFormatter={v =>
														v?.length >
														12
															? v.substring(
																	0,
																	12,
																) +
																"..."
															: v
													}
												/>
												<YAxis
													stroke="#555"
													tick={{
														fill: "#888",
														fontSize: 12,
														fontFamily: "ProximaNova",
													}}
													tickLine={false}
													axisLine={false}
												/>
												<Tooltip
													cursor={{
														fill: "rgba(255,255,255,0.05)",
													}}
													content={
														<CustomTooltip />
													}
												/>
												<Bar
													dataKey="play_count"
													radius={[
														6, 6, 0,
														0,
													]}
												>
													{chartData.map(
														(
															e: any,
															i: number,
														) => (
															<Cell
																key={
																	i
																}
																fill={
																	i ===
																	0
																		? "var(--color-primary)"
																		: "#333"
																}
																className="transition-all duration-300 hover:opacity-80 cursor-pointer"
															/>
														),
													)}
												</Bar>
											</BarChart>
										</ResponsiveContainer>
									</div>

									<div className="bg-mgray border border-white/10 rounded-2xl p-6 flex flex-col h-[500px]">
										<h2 className="text-xl font-metropolis font-bold mb-4">
											Scoreboard
										</h2>
										<ul className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar font-proximaNova">
											{chartData.map(
												(s: any, i: number) => (
													<Link
														href={`/info/${tab.slice(0, -1)}/${s.spotify_id}`}
														key={i}
													>
														<li className="flex items-center justify-between p-3 hover:bg-[#303030] rounded-xl transition-colors cursor-pointer group border border-transparent">
															<div className="flex items-center space-x-4 overflow-hidden">
																<span
																	className={`w-6 font-bold text-center ${i === 0 ? "text-[var(--color-primary)]" : "text-gray-500"}`}
																>
																	{i +
																		1}
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
																	<p className="font-bold text-sm text-white truncate group-hover:text-[var(--color-primary)] transition-colors font-metropolis">
																		{
																			s.displayName
																		}
																	</p>
																	<p className="text-xs text-gray-400 truncate mt-0.5">
																		{
																			s.subtext
																		}
																	</p>
																</div>
															</div>
															<div className="pl-4 text-right">
																<p className="text-sm font-bold text-white font-metropolis">
																	{
																		s.play_count
																	}
																</p>
																<p className="text-[10px] text-gray-500 uppercase mt-0.5 tracking-wider">
																	Plays
																</p>
															</div>
														</li>
													</Link>
												),
											)}
										</ul>
									</div>
								</div>
							)}
						</div>

						<div className="bg-mgray border border-white/10 rounded-2xl p-6 shadow-2xl">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-metropolis font-bold flex items-center">
									<FontAwesomeIcon
										icon={faClock}
										className="text-[var(--color-primary)] mr-3"
									/>{" "}
									Recently Played
								</h2>
								<div className="flex space-x-2">
									<button
										disabled={page === 1}
										onClick={() => setPage(p => p - 1)}
										className="p-2.5 px-4 bg-[#303030] hover:bg-[#404040] rounded-lg disabled:opacity-30 transition-colors cursor-pointer text-white"
									>
										<FontAwesomeIcon icon={faChevronLeft} />
									</button>
									<button
										disabled={!hasNextPage}
										onClick={() => setPage(p => p + 1)}
										className="p-2.5 px-4 bg-[#303030] hover:bg-[#404040] rounded-lg disabled:opacity-30 transition-colors cursor-pointer text-white"
									>
										<FontAwesomeIcon
											icon={faChevronRight}
										/>
									</button>
								</div>
							</div>

							{dbTimelineLoading ? (
								<div className="h-64 flex items-center justify-center">
									<p className="text-gray-400 font-bold font-proximaNova">
										Loading timeline...
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
									{recentData.map((s: any, i: number) => (
										<Link
											href={`/info/track/${s.track_id}`}
											key={i}
										>
											<div className="flex items-center p-3 hover:bg-[#303030] rounded-xl transition-colors cursor-pointer group border border-white/5">
												<img
													src={
														s.imageUrl ||
														"/images/logo.png"
													}
													className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform shadow-md"
													alt=""
												/>
												<div className="ml-4 truncate flex-1">
													<p className="font-bold text-white truncate group-hover:text-[var(--color-primary)] transition-colors font-metropolis">
														{
															s.displayName
														}
													</p>
													<p className="text-sm text-gray-400 truncate mt-0.5">
														{
															s.subtext
														}
													</p>
													<p className="text-xs text-gray-500 mt-1 font-proximaNova">
														{new Date(
															s.played_at,
														).toLocaleString()}
													</p>
												</div>
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				)}

				{activeTab === "overview" && <AdvancedInsights />}

				{activeTab === "lab" && <DeepLab />}
			</div>
		</div>
	);
}
