"use client";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdvancedInsights() {
	const { data, error, isLoading } = useSWR("/retrievify/spotify/scrobbler/insights", fetcher);

	if (isLoading) return <div className="text-gray-500 p-6 animate-pulse">Loading listening bio...</div>;
	if (error || !data?.data) return <div className="text-red-500 p-6">Failed to load insights.</div>;

	const { summary, hourly } = data.data;
	const totalHours = ((summary?.total_time_ms || 0) / 3600000).toFixed(1);

	const chartData = Array.from({ length: 24 }, (_, i) => {
		const hourData = hourly?.find((h: any) => h._id === i);
		return { hour: `${i.toString().padStart(2, "0")}:00`, Plays: hourData?.count || 0 };
	});

	const stats = [
		{ label: "Total Time", val: `${totalHours} hrs` },
		{ label: "Scrobbles", val: summary?.total_plays || 0 },
		{ label: "Unique Tracks", val: summary?.unique_tracks || 0 },
		{ label: "Unique Albums", val: summary?.unique_albums || 0 },
	];

	return (
		<div className="w-full text-white space-y-6 animate-in fade-in duration-500">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{stats.map((stat, i) => (
					<div
						key={i}
						className="bg-mgray p-5 rounded-xl border border-white/5 shadow-lg"
					>
						<p className="text-xs text-gray-400 font-metropolis uppercase tracking-wider">
							{stat.label}
						</p>
						<p className="text-3xl font-proximaNova text-primary mt-2">
							{stat.val.toLocaleString()}
						</p>
					</div>
				))}
			</div>

			<div className="bg-mgray p-6 rounded-2xl border border-white/5 shadow-lg">
				<div className="mb-6">
					<h3 className="text-xl font-proximaNova">Chronobiological Profile</h3>
					<p className="text-sm text-gray-400 font-metropolis">
						Your listening velocity across a 24-hour cycle.
					</p>
				</div>
				<div className="h-64 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={chartData}
							margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
						>
							<defs>
								<linearGradient
									id="colorPlays"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="5%"
										stopColor="#4ad3ff"
										stopOpacity={0.4}
									/>
									<stop
										offset="95%"
										stopColor="#4ad3ff"
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<XAxis
								dataKey="hour"
								stroke="#555"
								fontSize={11}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#555"
								fontSize={11}
								tickLine={false}
								axisLine={false}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "#202020",
									borderColor: "rgba(255,255,255,0.05)",
									borderRadius: "12px",
									color: "#fff",
								}}
								itemStyle={{ color: "#4ad3ff", fontWeight: "bold" }}
							/>
							<Area
								type="monotone"
								dataKey="Plays"
								stroke="#4ad3ff"
								strokeWidth={3}
								fillOpacity={1}
								fill="url(#colorPlays)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}
