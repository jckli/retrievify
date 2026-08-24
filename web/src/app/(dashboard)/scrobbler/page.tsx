"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Area, AreaChart, Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCog, faPlay, faSync } from "@fortawesome/free-solid-svg-icons";
import { fetcher } from "@/utils/fetcher";

type DashboardTab = "overview" | "top" | "history";
type Period = "all" | "month" | "custom";
type StatType = "tracks" | "artists" | "albums";

type Stat = {
    spotify_id: string;
    play_count: number;
    total_duration_ms: number;
};

function formatDuration(durationMs = 0) {
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

function localDayMs(value: string, end = false) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day, end ? 23 : 0, end ? 59 : 0, end ? 59 : 0, end ? 999 : 0).getTime();
}

function periodDetails(period: Period, startDate: string, endDate: string) {
    if (period === "all") return { label: "All time", query: "", ready: true };
    if (period === "month") {
        const now = new Date();
        return {
            label: "This month",
            query: new URLSearchParams({
                start: String(new Date(now.getFullYear(), now.getMonth(), 1).getTime()),
                end: String(now.getTime()),
            }).toString(),
            ready: true,
        };
    }
    if (!startDate || !endDate) return { label: "Custom range", query: "", ready: false };
    return {
        label: `${startDate} to ${endDate}`,
        query: new URLSearchParams({
            start: String(localDayMs(startDate)),
            end: String(localDayMs(endDate, true)),
        }).toString(),
        ready: localDayMs(startDate) <= localDayMs(endDate, true),
    };
}

export default function ScrobblerDashboard() {
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
    const [period, setPeriod] = useState<Period>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statType, setStatType] = useState<StatType>("tracks");
    const [page, setPage] = useState(1);
    const [hoveredHeatmap, setHoveredHeatmap] = useState<{ day: number; hour: number; plays: number; time: number; x: number; y: number } | null>(null);
    const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
    const selectedPeriod = useMemo(() => periodDetails(period, startDate, endDate), [period, startDate, endDate]);

    useEffect(() => setPage(1), [period, startDate, endDate]);

    const { data: statusData, isLoading: statusLoading } = useSWR("/retrievify/spotify/scrobbler/status", fetcher);
    const isSetup = statusData?.setup === true;
    const rangeSuffix = selectedPeriod.query ? `&${selectedPeriod.query}` : "";

    const {
        data: insightsData,
        error: insightsError,
        isLoading: insightsLoading,
        mutate: refreshInsights,
    } = useSWR(
        isSetup && selectedPeriod.ready && activeTab === "overview"
            ? `/retrievify/spotify/scrobbler/insights?timezone=${encodeURIComponent(timezone)}${rangeSuffix}`
            : null,
        fetcher,
    );
    const {
        data: statsData,
        error: statsError,
        isLoading: statsLoading,
        mutate: refreshStats,
    } = useSWR(
        isSetup && selectedPeriod.ready && activeTab === "top"
            ? `/retrievify/spotify/scrobbler/stats?type=${statType}&limit=15${rangeSuffix}`
            : null,
        fetcher,
    );
    const {
        data: timelineData,
        error: timelineError,
        isLoading: timelineLoading,
        mutate: refreshTimeline,
    } = useSWR(
        isSetup && selectedPeriod.ready && activeTab === "history"
            ? `/retrievify/spotify/scrobbler/timeline?page=${page}&limit=50${rangeSuffix}`
            : null,
        fetcher,
    );

    const topStats: Stat[] = statsData?.data || [];
    const topIds = topStats
        .map(item => item.spotify_id)
        .filter(Boolean)
        .join(",");
    const { data: spotifyTopData, isLoading: spotifyTopLoading } = useSWR(
        activeTab === "top" && topIds ? `/retrievify/spotify/${statType}?ids=${topIds}` : null,
        fetcher,
    );

    const timeline = timelineData?.data || [];
    const timelineIds = Array.from(new Set(timeline.map((item: any) => item.track_id)))
        .filter(Boolean)
        .join(",");
    const { data: spotifyTimelineData } = useSWR(
        activeTab === "history" && timelineIds ? `/retrievify/spotify/tracks?ids=${timelineIds}` : null,
        fetcher,
    );

    const insightArtists = insightsData?.data?.top_artists || [];
    const discoveries = insightsData?.data?.discoveries || {};
    const insightArtistIds = insightArtists.map((item: any) => item.spotify_id).filter(Boolean).join(",");
    const discoveryArtistIds = (discoveries.artists || []).map((item: any) => item.spotify_id).filter(Boolean).join(",");
    const { data: spotifyInsightArtists } = useSWR(
        activeTab === "overview" && insightArtistIds ? `/retrievify/spotify/artists?ids=${insightArtistIds}` : null,
        fetcher,
    );
    const { data: spotifyDiscoveryArtists } = useSWR(
        activeTab === "overview" && discoveryArtistIds ? `/retrievify/spotify/artists?ids=${discoveryArtistIds}` : null,
        fetcher,
    );
    const insightTrackId = insightsData?.data?.top_track?.spotify_id;
    const { data: spotifyInsightTrack } = useSWR(
        activeTab === "overview" && insightTrackId ? `/retrievify/spotify/tracks?ids=${insightTrackId}` : null,
        fetcher,
    );

    const topMusic = useMemo(() => {
        const spotifyItems = spotifyTopData?.[statType] || [];
        const spotifyByID = new Map(spotifyItems.map((item: any) => [item.id, item]));
        return topStats.map(stat => {
            const item: any = spotifyByID.get(stat.spotify_id) || {};
            return {
                ...stat,
                name: item.name || "Unknown",
                subtitle:
                    statType === "artists"
                        ? "Artist"
                        : item.artists?.map((artist: any) => artist.name).join(", ") || "Unknown artist",
                image: statType === "tracks" ? item.album?.images?.[0]?.url : item.images?.[0]?.url,
            };
        });
    }, [spotifyTopData, statType, topStats]);

    const recentPlays = useMemo(() => {
        const spotifyByID = new Map((spotifyTimelineData?.tracks || []).map((item: any) => [item.id, item]));
        return timeline.map((play: any) => {
            const track: any = spotifyByID.get(play.track_id) || {};
            return {
                ...play,
                name: track.name || "Unknown track",
                artist: track.artists?.map((artist: any) => artist.name).join(", ") || "Unknown artist",
                image: track.album?.images?.[0]?.url || "/images/logo.png",
            };
        });
    }, [spotifyTimelineData, timeline]);

    const hourly = useMemo(() => {
        const values = insightsData?.data?.hourly || [];
        return Array.from({ length: 24 }, (_, hour) => ({
            hour: `${String(hour).padStart(2, "0")}:00`,
            plays: values.find((item: any) => item._id === hour)?.count || 0,
        }));
    }, [insightsData]);

    const daily = insightsData?.data?.daily || [];
    const habits = insightsData?.data?.habits || {};
    const heatmap = useMemo(() => {
        const values = new Map((insightsData?.data?.weekday_hourly || []).map((item: any) => [`${item._id?.day}-${item._id?.hour}`, item]));
        const cells = Array.from({ length: 7 }, (_, day) => Array.from({ length: 24 }, (_, hour) => values.get(`${day}-${hour}`) || { plays: 0, total_time_ms: 0 }));
        const max = Math.max(1, ...cells.flat().map((item: any) => item.plays));
        return { cells, max };
    }, [insightsData]);
    const genres = useMemo(() => {
        const weights = new Map<string, number>();
        const plays = new Map<string, number>(insightArtists.map((item: any) => [item.spotify_id, Number(item.play_count) || 0]));
        for (const artist of (spotifyInsightArtists?.artists || []) as any[]) for (const genre of artist.genres || []) weights.set(String(genre), (weights.get(String(genre)) || 0) + (plays.get(artist.id) || 0));
        return [...weights.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    }, [spotifyInsightArtists, insightArtists]);
    const discoveryArtists = useMemo(() => {
        const byId = new Map((spotifyDiscoveryArtists?.artists || []).map((artist: any) => [artist.id, artist]));
        return (discoveries.artists || []).map((item: any) => byId.get(item.spotify_id)).filter(Boolean);
    }, [spotifyDiscoveryArtists, discoveries]);

    if (statusLoading)
        return <div className="min-h-[70vh] grid place-items-center text-gray-400">Loading listening data…</div>;

    if (!isSetup) {
        return (
            <div className="min-h-[70vh] grid place-items-center p-6">
                <div className="max-w-md text-center bg-mgray border border-white/10 rounded-2xl p-8">
                    <FontAwesomeIcon icon={faCog} className="text-4xl text-[var(--color-primary)] mb-5" />
                    <h1 className="text-2xl font-bold font-metropolis">Set up listening history</h1>
                    <p className="text-gray-400 mt-3">Connect Spotify to start saving your recent plays.</p>
                    <Link
                        href="/scrobbler/setup"
                        className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-lg bg-[var(--color-primary)] text-black font-bold"
                    >
                        Start setup <FontAwesomeIcon icon={faPlay} />
                    </Link>
                </div>
            </div>
        );
    }

    const summary = insightsData?.data?.summary;
    const hasNextPage = timelineData?.has_next || false;
    const isTopLoading = statsLoading || (topStats.length > 0 && spotifyTopLoading);
    const refresh = () => {
        if (activeTab === "overview") refreshInsights();
        if (activeTab === "top") refreshStats();
        if (activeTab === "history") refreshTimeline();
    };

    return (
        <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold font-metropolis">Your Scrobbler</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={refresh}
                        className="h-11 w-11 inline-flex items-center justify-center cursor-pointer rounded-lg border border-white/10 bg-mgray hover:bg-white/10"
                        aria-label="Refresh listening data"
                    >
                        <FontAwesomeIcon icon={faSync} />
                    </button>
                    <Link
                        href="/scrobbler/setup"
                        className="h-11 inline-flex items-center px-4 cursor-pointer rounded-lg border border-white/10 bg-mgray hover:bg-white/10 text-sm font-bold"
                    >
                        <FontAwesomeIcon icon={faCog} className="mr-2" />
                        Settings
                    </Link>
                </div>
            </header>

            <section className="flex flex-col gap-3 rounded-xl border border-white/10 bg-mgray p-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-1">
                    {(
                        [
                            ["all", "All time"],
                            ["month", "This month"],
                            ["custom", "Custom"],
                        ] as const
                    ).map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => setPeriod(value)}
                            className={`cursor-pointer px-3 py-2 rounded-md text-sm font-bold ${period === value ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                {period === "custom" && (
                    <div className="flex flex-wrap items-end gap-3 text-gray-300">
                        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                            From
                            <input
                                type="date"
                                value={startDate}
                                onChange={event => setStartDate(event.target.value)}
                                className="h-10 cursor-pointer rounded-md border border-white/10 bg-[#151515] px-3 text-sm font-normal normal-case tracking-normal text-white [color-scheme:dark] outline-none focus:border-[var(--color-primary)]"
                            />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-gray-400">
                            To
                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={event => setEndDate(event.target.value)}
                                className="h-10 cursor-pointer rounded-md border border-white/10 bg-[#151515] px-3 text-sm font-normal normal-case tracking-normal text-white [color-scheme:dark] outline-none focus:border-[var(--color-primary)]"
                            />
                        </label>
                    </div>
                )}
            </section>

            <nav className="flex gap-5 border-b border-white/10" aria-label="Scrobbler sections">
                {(
                    [
                        ["overview", "Overview"],
                        ["top", "Top music"],
                        ["history", "History"],
                    ] as const
                ).map(([value, label]) => (
                    <button
                        key={value}
                        onClick={() => setActiveTab(value)}
                        className={`cursor-pointer pb-3 text-sm font-bold border-b-2 ${activeTab === value ? "border-[var(--color-primary)] text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {!selectedPeriod.ready ? (
                <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-gray-400">
                    Choose a start and end date to see that range.
                </div>
            ) : activeTab === "overview" ? (
                <div className="space-y-6">
                    {insightsError ? (
                        <ErrorState />
                    ) : insightsLoading ? (
                        <LoadingState />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                <SummaryCard label="Time listened" value={formatDuration(summary?.total_time_ms)} />
                                <SummaryCard label="Plays" value={Number(summary?.total_plays || 0).toLocaleString()} />
                                <SummaryCard
                                    label="Artists"
                                    value={Number(summary?.unique_artists || 0).toLocaleString()}
                                />
                                <SummaryCard
                                    label="Tracks"
                                    value={Number(summary?.unique_tracks || 0).toLocaleString()}
                                />
                            </div>
                            <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                                <InsightCard label="Longest streak" value={`${habits.longest_streak_days || 0} days`} />
                                <InsightCard label="Listening sessions" value={Number(habits.sessions || 0).toLocaleString()} />
                                <InsightCard label="Longest session" value={formatDuration(habits.longest_session_ms)} />
                                <InsightCard label="Plays per track" value={(Number(summary?.total_plays || 0) / Math.max(1, Number(summary?.unique_tracks || 0))).toFixed(1)} />
                            </section>
                            <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                <h2 className="text-lg font-bold font-metropolis">Listening activity</h2>
                                <p className="text-sm text-gray-400 mt-1">Every day in {selectedPeriod.label.toLowerCase()}.</p>
                                <div className="h-56 mt-5">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={daily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                            <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={40} tickFormatter={(value: string) => value.slice(5)} />
                                            <YAxis tick={{ fill: "#888", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                            <Tooltip contentStyle={{ background: "#202020", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} formatter={(value) => [`${Number(value || 0)} plays`, "Played"]} />
                                            <Area type="monotone" dataKey="plays" stroke="#4ad3ff" strokeWidth={2} fill="#4ad3ff" fillOpacity={0.18} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>
                            <section className="rounded-xl border border-white/10 bg-mgray p-5 overflow-x-auto">
                                <h2 className="text-lg font-bold font-metropolis">Your listening week</h2>
                                <p className="text-sm text-gray-400 mt-1">Darker to brighter means more plays in your local time.</p>
                                <div className="mt-5 min-w-[620px] grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-1 text-[10px] text-gray-500">
                                    <span />{Array.from({ length: 24 }, (_, hour) => <span key={hour} className="text-center">{hour % 3 === 0 ? hour : ""}</span>)}
                                    {heatmap.cells.map((row: any[], day: number) => <Fragment key={day}><span className="self-center">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}</span>{row.map((cell: any, hour: number) => <button key={hour} type="button" onMouseMove={event => setHoveredHeatmap({ day, hour, plays: cell.plays, time: cell.total_time_ms, x: event.clientX, y: event.clientY })} onMouseLeave={() => setHoveredHeatmap(null)} onFocus={event => { const rect = event.currentTarget.getBoundingClientRect(); setHoveredHeatmap({ day, hour, plays: cell.plays, time: cell.total_time_ms, x: rect.left + rect.width / 2, y: rect.top }); }} onBlur={() => setHoveredHeatmap(null)} aria-label={`${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}, ${hour}:00: ${cell.plays} plays, ${formatDuration(cell.total_time_ms)}`} className="aspect-square cursor-pointer rounded-sm outline-none ring-[var(--color-primary)] focus:ring-2" style={{ backgroundColor: `rgba(74,211,255,${0.08 + (cell.plays / heatmap.max) * 0.82})` }} />)}</Fragment>)}
                                </div>
                                {hoveredHeatmap ? <div className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-[#202020] px-3 py-2 text-xs text-white shadow-xl" style={{ left: hoveredHeatmap.x, top: hoveredHeatmap.y - 10 }}><p className="font-bold">{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][hoveredHeatmap.day]}, {String(hoveredHeatmap.hour).padStart(2, "0")}:00</p><p className="text-gray-300">{hoveredHeatmap.plays} plays · {formatDuration(hoveredHeatmap.time)}</p></div> : null}
                            </section>
                            <div className="grid gap-5 lg:grid-cols-2">
                                <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                    <h2 className="text-lg font-bold font-metropolis">On repeat</h2>
                                    {spotifyInsightTrack?.tracks?.[0] ? <Link href={`/info/track/${insightTrackId}`} className="mt-4 flex items-center gap-4 rounded-lg p-2 hover:bg-white/5"><img src={spotifyInsightTrack.tracks[0].album?.images?.[0]?.url || "/images/logo.png"} alt="" className="h-16 w-16 rounded object-cover" /><div className="min-w-0"><p className="font-bold truncate">{spotifyInsightTrack.tracks[0].name}</p><p className="text-sm text-gray-400 truncate">{spotifyInsightTrack.tracks[0].artists?.map((artist: any) => artist.name).join(", ")}</p><p className="mt-1 text-xs text-[var(--color-primary)]">{insightsData?.data?.top_track?.play_count || 0} plays · {formatDuration(insightsData?.data?.top_track?.total_duration_ms)}</p></div></Link> : <p className="mt-4 text-sm text-gray-400">No track data for this period.</p>}
                                </section>
                                <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                    <h2 className="text-lg font-bold font-metropolis">Taste snapshot</h2>
                                    <p className="text-sm text-gray-400 mt-1">Genres from your top artists this period.</p>
                                    {genres.length ? <div className="mt-4 flex flex-wrap gap-2">{genres.map(([genre, plays]) => <span key={genre} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm capitalize">{genre} <span className="text-gray-500">{plays}</span></span>)}</div> : <p className="mt-4 text-sm text-gray-400">Spotify genre data is unavailable for these artists.</p>}
                                </section>
                            </div>
                            <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                <h2 className="text-lg font-bold font-metropolis">Your biggest discoveries</h2>
                                <p className="text-sm text-gray-400 mt-1">{Number(discoveries.count?.[0]?.count || 0).toLocaleString()} artists first appeared in this period.</p>
                                {discoveryArtists.length ? <div className="mt-4 flex flex-wrap gap-2">{discoveryArtists.map((artist: any) => <span key={artist.id} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-3"><img src={artist.images?.[2]?.url || artist.images?.[0]?.url || "/images/logo.png"} alt="" className="h-6 w-6 rounded-full object-cover" />{artist.name}</span>)}</div> : null}
                            </section>
                            <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                <h2 className="text-lg font-bold font-metropolis">Listening by time of day</h2>
                                <p className="text-sm text-gray-400 mt-1">When you played music in your local time.</p>
                                <div className="h-72 mt-5">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={hourly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                            <XAxis
                                                dataKey="hour"
                                                tick={{ fill: "#888", fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                interval={2}
                                            />
                                            <YAxis
                                                tick={{ fill: "#888", fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                allowDecimals={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    background: "#202020",
                                                    border: "1px solid rgba(255,255,255,.1)",
                                                    borderRadius: 8,
                                                }}
                                                formatter={value => [`${Number(value || 0)} plays`, "Played"]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="plays"
                                                stroke="#4ad3ff"
                                                strokeWidth={2}
                                                fill="#4ad3ff"
                                                fillOpacity={0.18}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            ) : activeTab === "top" ? (
                <div className="space-y-5">
                    <div className="flex gap-1 w-fit rounded-lg border border-white/10 bg-mgray p-1">
                        {(["tracks", "artists", "albums"] as StatType[]).map(value => (
                            <button
                                key={value}
                                onClick={() => setStatType(value)}
                                className={`cursor-pointer capitalize px-3 py-2 rounded-md text-sm font-bold ${statType === value ? "bg-[var(--color-primary)] text-black" : "text-gray-400 hover:text-white"}`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    {statsError ? (
                        <ErrorState />
                    ) : isTopLoading ? (
                        <LoadingState />
                    ) : topMusic.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                            <section className="xl:col-span-3 rounded-xl border border-white/10 bg-mgray p-5 h-[420px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topMusic} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fill: "#888", fontSize: 11 }}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(name: string) =>
                                                name.length > 14 ? `${name.slice(0, 14)}…` : name
                                            }
                                        />
                                        <YAxis
                                            tick={{ fill: "#888", fontSize: 11 }}
                                            tickLine={false}
                                            axisLine={false}
                                            allowDecimals={false}
                                        />
                                        <Tooltip content={<TopTooltip />} cursor={{ fill: "rgba(255,255,255,.04)" }} />
                                        <Bar dataKey="play_count" radius={[4, 4, 0, 0]}>
                                            {topMusic.map((_, index) => (
                                                <Cell key={index} fill={index === 0 ? "#4ad3ff" : "#3b3b3b"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </section>
                            <ol className="xl:col-span-2 space-y-2 rounded-xl border border-white/10 bg-mgray p-3 max-h-[420px] overflow-y-auto">
                                {topMusic.map((item, index) => (
                                    <TopRow key={item.spotify_id} item={item} index={index} type={statType} />
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
            ) : (
                <section className="rounded-xl border border-white/10 bg-mgray p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-lg font-bold font-metropolis">Recently played</h2>
                            <p className="text-sm text-gray-400 mt-1">{selectedPeriod.label}</p>
                        </div>
                        <div className="flex gap-1">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(current => current - 1)}
                                className="cursor-pointer p-2 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <button
                                disabled={!hasNextPage}
                                onClick={() => setPage(current => current + 1)}
                                className="cursor-pointer p-2 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    </div>
                    {timelineError ? (
                        <ErrorState />
                    ) : timelineLoading ? (
                        <LoadingState />
                    ) : recentPlays.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {recentPlays.map((play: any) => (
                                <Link
                                    key={`${play.track_id}-${play.played_at}`}
                                    href={`/info/track/${play.track_id}`}
                                    className="flex gap-3 rounded-lg p-2 hover:bg-white/5"
                                >
                                    <img src={play.image} alt="" className="w-12 h-12 rounded object-cover" />
                                    <div className="min-w-0">
                                        <p className="font-bold truncate">{play.name}</p>
                                        <p className="text-sm text-gray-400 truncate">{play.artist}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(play.played_at).toLocaleDateString(undefined, {
                                                month: "2-digit",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-mgray p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
    );
}

function InsightCard({ label, value }: { label: string; value: string }) {
    return <div className="rounded-xl border border-white/10 bg-mgray p-4"><p className="text-xs uppercase tracking-wide text-gray-400">{label}</p><p className="mt-2 text-lg font-bold">{value}</p></div>;
}

function LoadingState() {
    return <div className="rounded-xl border border-white/10 bg-mgray p-10 text-center text-gray-400">Loading…</div>;
}

function EmptyState() {
    return (
        <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-gray-400">
            Nothing to show for this period.
        </div>
    );
}

function ErrorState() {
    return (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
            Couldn’t load this section. Try refreshing.
        </div>
    );
}

function TopTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
        <div className="rounded-lg border border-white/10 bg-[#202020] p-3">
            <p className="font-bold">{item.name}</p>
            <p className="text-sm text-gray-400">{item.subtitle}</p>
            <p className="text-sm text-[var(--color-primary)] mt-2">
                {item.play_count} plays · {formatDuration(item.total_duration_ms)}
            </p>
        </div>
    );
}

function TopRow({ item, index, type }: { item: any; index: number; type: StatType }) {
    const singular = type.slice(0, -1);
    return (
        <li>
            <Link
                href={`/info/${singular}/${item.spotify_id}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5"
            >
                <span className="w-5 text-sm text-gray-500">{index + 1}</span>
                <img src={item.image || "/images/logo.png"} alt="" className="w-11 h-11 rounded object-cover" />
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                </div>
                <p className="text-right text-xs text-gray-400 whitespace-nowrap">
                    {item.play_count} plays
                    <br />
                    {formatDuration(item.total_duration_ms)}
                </p>
            </Link>
        </li>
    );
}
