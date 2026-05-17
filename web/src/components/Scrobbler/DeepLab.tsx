"use client";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function DeepLab() {
	const { data, error, isLoading } = useSWR("/retrievify/spotify/scrobbler/deep-analytics", fetcher);

	if (isLoading) return <div className="text-gray-500 p-6 animate-pulse">Running Deep Diagnostics...</div>;
	if (error || !data?.data) return <div className="text-red-500 p-6">Diagnostics failed.</div>;

	const { obsession, discovery } = data.data;

	const formatContext = (uri: string) => {
		if (!uri) return "Direct / Library";
		const parts = uri.split(":");
		return parts.length > 2 ? `${parts[1].toUpperCase()} (${parts[2].slice(0, 8)}...)` : uri;
	};

	return (
		<div className="w-full text-white space-y-6 animate-in fade-in duration-500">
			<div className="bg-mgray p-6 rounded-2xl border border-white/5 shadow-lg">
				<div className="mb-6">
					<h3 className="text-xl font-proximaNova text-primary">The Obsession Curve</h3>
					<p className="text-sm text-gray-400 font-metropolis">
						Tracks burned out fastest (Plays per day active, min 10 plays).
					</p>
				</div>
				<div className="h-80 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={obsession?.slice(0, 10)}
							layout="vertical"
							margin={{ left: -10, right: 20 }}
						>
							<XAxis type="number" hide />
							<YAxis
								dataKey="_id"
								type="category"
								width={140}
								tick={{ fill: "#aaa", fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								cursor={{ fill: "rgba(255,255,255,0.02)" }}
								contentStyle={{
									backgroundColor: "#202020",
									borderColor: "rgba(255,255,255,0.05)",
									borderRadius: "12px",
								}}
								formatter={(val: any) => [
									`${Number(val || 0).toFixed(2)} plays/day`,
									"Velocity",
								]}
								labelStyle={{ display: "none" }}
							/>
							<Bar dataKey="velocity" radius={[0, 6, 6, 0]} barSize={24}>
								{obsession?.slice(0, 10).map((_: any, i: number) => (
									<Cell
										key={`cell-${i}`}
										fill={i === 0 ? "#4ad3ff" : "#1e5c73"}
										className="transition-all hover:opacity-80"
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="bg-mgray p-6 rounded-2xl border border-white/5 shadow-lg">
				<div className="mb-6">
					<h3 className="text-xl font-proximaNova text-primary">
						Contextual Discovery Funnel
					</h3>
					<p className="text-sm text-gray-400 font-metropolis">
						Which Spotify contexts yield long-term favorites? (5+ retained plays)
					</p>
				</div>
				<div className="space-y-5">
					{discovery?.slice(0, 8).map((ctx: any, i: number) => (
						<div key={i} className="flex flex-col space-y-2">
							<div className="flex justify-between items-end">
								<span className="font-metropolis text-gray-200 text-sm truncate max-w-[70%]">
									{formatContext(ctx._id)}
									<span className="text-gray-500 text-xs ml-2">
										({ctx.discovered} discoveries)
									</span>
								</span>
								<span className="text-primary font-bold text-sm">
									{ctx.retention_rate.toFixed(1)}% Retained
								</span>
							</div>
							<div className="w-full bg-black/40 rounded-full h-3 overflow-hidden shadow-inner">
								<div
									className="bg-gradient-to-r from-[#1e5c73] to-[#4ad3ff] h-full rounded-full transition-all duration-1000 ease-out"
									style={{
										width: `${Math.min(ctx.retention_rate, 100)}%`,
									}}
								/>
							</div>
						</div>
					))}
					{(!discovery || discovery.length === 0) && (
						<p className="text-gray-500 text-sm">
							Not enough data to calculate retention rates yet. Keep
							scrobbling!
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
