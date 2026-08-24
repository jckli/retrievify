"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Area, AreaChart, Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCog, faPlay, faSync } from "@fortawesome/free-solid-svg-icons";
import { fetcher } from "@/utils/fetcher";

type DashboardTab = "overview" | "recap" | "top" | "history";
type Period = "all" | "month" | "year" | "custom";
type StatType = "tracks" | "artists" | "albums";

type Stat = {
    spotify_id: string;
    play_count: number;
    total_duration_ms: number;
    first_played_at?: string;
    last_played_at?: string;
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

function rangedPeriod(label: string, start: number, end: number, comparisonLabel = "the preceding equal-length period") {
    const span = end - start;
    return {
        label,
        query: new URLSearchParams({ start: String(start), end: String(end) }).toString(),
        previousQuery: new URLSearchParams({ start: String(start - span - 1), end: String(start - 1) }).toString(),
        comparisonLabel,
        ready: true,
    };
}

function periodDetails(period: Period, startDate: string, endDate: string, year: number) {
    if (period === "all") return { label: "All time", query: "", previousQuery: "", comparisonLabel: "", ready: true };
    if (period === "month") {
        const now = new Date();
        return rangedPeriod("This month", new Date(now.getFullYear(), now.getMonth(), 1).getTime(), now.getTime());
    }
    if (period === "year")
        return rangedPeriod(String(year), new Date(year, 0, 1).getTime(), new Date(year, 11, 31, 23, 59, 59, 999).getTime(), String(year - 1));
    if (!startDate || !endDate) return { label: "Custom range", query: "", previousQuery: "", comparisonLabel: "", ready: false };
    const start = localDayMs(startDate);
    const end = localDayMs(endDate, true);
    return end < start ? { label: "Custom range", query: "", previousQuery: "", comparisonLabel: "", ready: false } : rangedPeriod(`${startDate} to ${endDate}`, start, end);
}

export default function ScrobblerDashboard() {
    const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
    const [period, setPeriod] = useState<Period>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statType, setStatType] = useState<StatType>("tracks");
    const [statSort, setStatSort] = useState<"plays" | "time">("plays");
    const [page, setPage] = useState(1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [hoveredHeatmap, setHoveredHeatmap] = useState<{
        day: number;
        hour: number;
        plays: number;
        time: number;
        x: number;
        y: number;
    } | null>(null);
    const timezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC", []);
    const selectedPeriod = useMemo(
        () => periodDetails(period, startDate, endDate, selectedYear),
        [period, startDate, endDate, selectedYear],
    );

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
            ? `/retrievify/spotify/scrobbler/stats?type=${statType}&limit=50&sort=${statSort}${rangeSuffix}`
            : null,
        fetcher,
    );
    const { data: previousStatsData } = useSWR(
        isSetup && activeTab === "top" && selectedPeriod.previousQuery
            ? `/retrievify/spotify/scrobbler/stats?type=${statType}&limit=50&sort=${statSort}&${selectedPeriod.previousQuery}`
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
    const insightArtistIds = insightArtists
        .map((item: any) => item.spotify_id)
        .filter(Boolean)
        .join(",");
    const discoveryArtistIds = (discoveries.artists || [])
        .map((item: any) => item.spotify_id)
        .filter(Boolean)
        .join(",");
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
    const {
        data: recapData,
        error: recapError,
        isLoading: recapLoading,
        mutate: refreshRecap,
    } = useSWR(
        activeTab === "recap" && period === "year"
            ? `/retrievify/spotify/scrobbler/recap?year=${selectedYear}&timezone=${encodeURIComponent(timezone)}`
            : null,
        fetcher,
    );
    const recapArtistIds = Array.from(
        new Set(
            [...(recapData?.data?.top_artists || []), ...(recapData?.data?.monthly || [])]
                .map((item: any) => item.spotify_id)
                .filter(Boolean),
        ),
    ).join(",");
    const { data: spotifyRecapArtists } = useSWR(
        activeTab === "recap" && recapArtistIds ? `/retrievify/spotify/artists?ids=${recapArtistIds}` : null,
        fetcher,
    );
    const recapTrackID = recapData?.data?.archive?.top_track;
    const { data: spotifyRecapTrack } = useSWR(
        activeTab === "recap" && recapTrackID ? `/retrievify/spotify/tracks?ids=${recapTrackID}` : null,
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
    const previousRanks = useMemo(
        () => new Map(((previousStatsData?.data || []) as Stat[]).map((item, index) => [item.spotify_id, index + 1])),
        [previousStatsData],
    );
    const topChart = topMusic.slice(0, 15);
    const topTenPlays = topMusic.slice(0, 10).reduce((total, item) => total + item.play_count, 0);
    const totalPlays = Number(statsData?.summary?.total_plays || 0);

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
        const values = new Map(
            (insightsData?.data?.weekday_hourly || []).map((item: any) => [`${item._id?.day}-${item._id?.hour}`, item]),
        );
        const cells = Array.from({ length: 7 }, (_, day) =>
            Array.from({ length: 24 }, (_, hour) => values.get(`${day}-${hour}`) || { plays: 0, total_time_ms: 0 }),
        );
        const max = Math.max(1, ...cells.flat().map((item: any) => item.plays));
        return { cells, max };
    }, [insightsData]);
    const genres = useMemo(() => {
        const weights = new Map<string, number>();
        const plays = new Map<string, number>(
            insightArtists.map((item: any) => [item.spotify_id, Number(item.play_count) || 0]),
        );
        for (const artist of (spotifyInsightArtists?.artists || []) as any[])
            for (const genre of artist.genres || [])
                weights.set(String(genre), (weights.get(String(genre)) || 0) + (plays.get(artist.id) || 0));
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
        if (activeTab === "recap") refreshRecap();
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
                            ["year", "Year"],
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
                {period === "year" && (
                    <select
                        value={selectedYear}
                        onChange={event => setSelectedYear(Number(event.target.value))}
                        className="h-10 cursor-pointer rounded-md border border-white/10 bg-[#151515] px-3 text-sm text-white [color-scheme:dark]"
                    >
                        {Array.from(
                            { length: new Date().getFullYear() - 2020 + 1 },
                            (_, index) => new Date().getFullYear() - index,
                        ).map(year => (
                            <option key={year}>{year}</option>
                        ))}
                    </select>
                )}
            </section>

            <nav className="flex gap-5 border-b border-white/10" aria-label="Scrobbler sections">
                {(
                    [
                        ["overview", "Overview"],
                        ["recap", "Year in music"],
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
            ) : activeTab === "recap" ? (
                period !== "year" ? (
                    <div className="rounded-xl border border-dashed border-white/15 p-10 text-center text-gray-400">
                        Choose a calendar year to view your recap.
                    </div>
                ) : recapError ? (
                    <ErrorState />
                ) : recapLoading ? (
                    <LoadingState />
                ) : (
                    <YearRecap
                        recap={recapData?.data}
                        artists={spotifyRecapArtists?.artists || []}
                        track={spotifyRecapTrack?.tracks?.[0]}
                        year={selectedYear}
                    />
                )
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
                                <InsightCard
                                    label="Listening sessions"
                                    value={Number(habits.sessions || 0).toLocaleString()}
                                />
                                <InsightCard
                                    label="Longest session"
                                    value={formatDuration(habits.longest_session_ms)}
                                />
                                <InsightCard
                                    label="Plays per track"
                                    value={(
                                        Number(summary?.total_plays || 0) /
                                        Math.max(1, Number(summary?.unique_tracks || 0))
                                    ).toFixed(1)}
                                />
                            </section>
                            <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                <h2 className="text-lg font-bold font-metropolis">Listening activity</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Every day in {selectedPeriod.label.toLowerCase()}.
                                </p>
                                <div className="h-56 mt-5">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={daily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fill: "#888", fontSize: 11 }}
                                                tickLine={false}
                                                axisLine={false}
                                                minTickGap={40}
                                                tickFormatter={(value: string) => value.slice(5)}
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
                            <section className="rounded-xl border border-white/10 bg-mgray p-5 overflow-x-auto">
                                <h2 className="text-lg font-bold font-metropolis">Your listening week</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    Darker to brighter means more plays in your local time.
                                </p>
                                <div className="mt-5 min-w-[620px] grid grid-cols-[40px_repeat(24,minmax(0,1fr))] gap-1 text-[10px] text-gray-500">
                                    <span />
                                    {Array.from({ length: 24 }, (_, hour) => (
                                        <span key={hour} className="text-center">
                                            {hour % 3 === 0 ? hour : ""}
                                        </span>
                                    ))}
                                    {heatmap.cells.map((row: any[], day: number) => (
                                        <Fragment key={day}>
                                            <span className="self-center">
                                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day]}
                                            </span>
                                            {row.map((cell: any, hour: number) => (
                                                <button
                                                    key={hour}
                                                    type="button"
                                                    onMouseMove={event =>
                                                        setHoveredHeatmap({
                                                            day,
                                                            hour,
                                                            plays: cell.plays,
                                                            time: cell.total_time_ms,
                                                            x: event.clientX,
                                                            y: event.clientY,
                                                        })
                                                    }
                                                    onMouseLeave={() => setHoveredHeatmap(null)}
                                                    onFocus={event => {
                                                        const rect = event.currentTarget.getBoundingClientRect();
                                                        setHoveredHeatmap({
                                                            day,
                                                            hour,
                                                            plays: cell.plays,
                                                            time: cell.total_time_ms,
                                                            x: rect.left + rect.width / 2,
                                                            y: rect.top,
                                                        });
                                                    }}
                                                    onBlur={() => setHoveredHeatmap(null)}
                                                    aria-label={`${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}, ${hour}:00: ${cell.plays} plays, ${formatDuration(cell.total_time_ms)}`}
                                                    className="aspect-square cursor-pointer rounded-sm outline-none ring-[var(--color-primary)] focus:ring-2"
                                                    style={{
                                                        backgroundColor: `rgba(74,211,255,${0.08 + (cell.plays / heatmap.max) * 0.82})`,
                                                    }}
                                                />
                                            ))}
                                        </Fragment>
                                    ))}
                                </div>
                                {hoveredHeatmap ? (
                                    <div
                                        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-[#202020] px-3 py-2 text-xs text-white shadow-xl"
                                        style={{ left: hoveredHeatmap.x, top: hoveredHeatmap.y - 10 }}
                                    >
                                        <p className="font-bold">
                                            {
                                                [
                                                    "Sunday",
                                                    "Monday",
                                                    "Tuesday",
                                                    "Wednesday",
                                                    "Thursday",
                                                    "Friday",
                                                    "Saturday",
                                                ][hoveredHeatmap.day]
                                            }
                                            , {String(hoveredHeatmap.hour).padStart(2, "0")}:00
                                        </p>
                                        <p className="text-gray-300">
                                            {hoveredHeatmap.plays} plays · {formatDuration(hoveredHeatmap.time)}
                                        </p>
                                    </div>
                                ) : null}
                            </section>
                            <div className="grid gap-5 lg:grid-cols-2">
                                <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                    <h2 className="text-lg font-bold font-metropolis">On repeat</h2>
                                    {spotifyInsightTrack?.tracks?.[0] ? (
                                        <Link
                                            href={`/info/track/${insightTrackId}`}
                                            className="mt-4 flex items-center gap-4 rounded-lg p-2 hover:bg-white/5"
                                        >
                                            <img
                                                src={
                                                    spotifyInsightTrack.tracks[0].album?.images?.[0]?.url ||
                                                    "/images/logo.png"
                                                }
                                                alt=""
                                                className="h-16 w-16 rounded object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-bold truncate">
                                                    {spotifyInsightTrack.tracks[0].name}
                                                </p>
                                                <p className="text-sm text-gray-400 truncate">
                                                    {spotifyInsightTrack.tracks[0].artists
                                                        ?.map((artist: any) => artist.name)
                                                        .join(", ")}
                                                </p>
                                                <p className="mt-1 text-xs text-[var(--color-primary)]">
                                                    {insightsData?.data?.top_track?.play_count || 0} plays ·{" "}
                                                    {formatDuration(insightsData?.data?.top_track?.total_duration_ms)}
                                                </p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <p className="mt-4 text-sm text-gray-400">No track data for this period.</p>
                                    )}
                                </section>
                                <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                    <h2 className="text-lg font-bold font-metropolis">Taste snapshot</h2>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Genres from your top artists this period.
                                    </p>
                                    {genres.length ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {genres.map(([genre, plays]) => (
                                                <span
                                                    key={genre}
                                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm capitalize"
                                                >
                                                    {genre} <span className="text-gray-500">{plays}</span>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-4 text-sm text-gray-400">
                                            Spotify genre data is unavailable for these artists.
                                        </p>
                                    )}
                                </section>
                            </div>
                            <section className="rounded-xl border border-white/10 bg-mgray p-5">
                                <h2 className="text-lg font-bold font-metropolis">Your biggest discoveries</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    {Number(discoveries.count?.[0]?.count || 0).toLocaleString()} artists first appeared
                                    in this period.
                                </p>
                                {discoveryArtists.length ? (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {discoveryArtists.map((artist: any) => (
                                            <span
                                                key={artist.id}
                                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-3"
                                            >
                                                <img
                                                    src={
                                                        artist.images?.[2]?.url ||
                                                        artist.images?.[0]?.url ||
                                                        "/images/logo.png"
                                                    }
                                                    alt=""
                                                    className="h-6 w-6 rounded-full object-cover"
                                                />
                                                {artist.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}
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
                    <div className="flex flex-wrap items-center gap-3">
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
                        <div className="flex gap-1 rounded-lg border border-white/10 bg-mgray p-1">
                            {(["plays", "time"] as const).map(value => (
                                <button
                                    key={value}
                                    onClick={() => setStatSort(value)}
                                    className={`cursor-pointer rounded-md px-3 py-2 text-sm font-bold ${statSort === value ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"}`}
                                >
                                    {value === "plays" ? "Plays" : "Time listened"}
                                </button>
                            ))}
                        </div>
                    </div>
                    {statsError ? (
                        <ErrorState />
                    ) : isTopLoading ? (
                        <LoadingState />
                    ) : topMusic.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <RankingCard label={`Top ${statType.slice(0, -1)}`} value={topMusic[0].name} detail={`${topMusic[0].play_count.toLocaleString()} plays · ${formatDuration(topMusic[0].total_duration_ms)}`} />
                                <RankingCard label={`Time on top ${statType.slice(0, -1)}`} value={formatDuration(topMusic[0].total_duration_ms)} detail={`${topMusic[0].play_count.toLocaleString()} plays`} />
                                <RankingCard
                                    label={statType === "artists" ? "Top 10 artist plays" : "Top 10 plays"}
                                    value={`${topTenPlays.toLocaleString()} plays`}
                                    detail={statType === "artists" ? "artist appearances" : `${Math.round((topTenPlays / Math.max(1, totalPlays)) * 100)}% of ${totalPlays.toLocaleString()} total plays`}
                                />
                            </div>
                            {selectedPeriod.comparisonLabel ? <p className="text-sm text-gray-400">Rank movement compares with {selectedPeriod.comparisonLabel}. “New to top 50” means the item was outside that period’s top 50.</p> : null}
                            <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
                            <section className="xl:col-span-3 flex h-[420px] min-h-0 flex-col rounded-xl border border-white/10 bg-mgray p-5">
                                <div className="mb-3">
                                    <h2 className="text-lg font-bold font-metropolis">Top {statType}</h2>
                                    <p className="text-sm text-gray-400">Top 15 of 50, ranked by {statSort === "plays" ? "plays" : "listening time"}.</p>
                                </div>
                                <div className="min-h-0 flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topChart} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
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
                                        <Tooltip content={<TopTooltip sort={statSort} />} cursor={{ fill: "rgba(255,255,255,.04)" }} />
                                        <Bar dataKey={statSort === "plays" ? "play_count" : "total_duration_ms"} radius={[4, 4, 0, 0]}>
                                            {topChart.map((_, index) => (
                                                <Cell key={index} fill={index === 0 ? "#4ad3ff" : "#3b3b3b"} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                                </div>
                            </section>
                            <ol className="xl:col-span-2 space-y-2 rounded-xl border border-white/10 bg-mgray p-3 max-h-[420px] overflow-y-auto">
                                {topMusic.map((item, index) => (
                                    <TopRow key={item.spotify_id} item={item} index={index} type={statType} previousRank={previousRanks.get(item.spotify_id)} hasPrevious={Boolean(selectedPeriod.previousQuery && previousStatsData)} />
                                ))}
                            </ol>
                        </div>
                        </>
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
    return (
        <div className="rounded-xl border border-white/10 bg-mgray p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-2 text-lg font-bold">{value}</p>
        </div>
    );
}

function RankingCard({ label, value, detail }: { label: string; value: string; detail: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-mgray p-4">
            <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
            <p className="mt-2 truncate text-lg font-bold" title={value}>{value}</p>
            <p className="mt-1 truncate text-xs text-gray-500" title={detail}>{detail}</p>
        </div>
    );
}

function YearRecap({ recap, artists, track, year }: { recap: any; artists: any[]; track: any; year: number }) {
    const artistByID = new Map(artists.map(artist => [artist.id, artist]));
    const topArtists = recap?.top_artists || [];
    const monthly = recap?.monthly || [];
    const archive = recap?.archive || {};
    const date = archive.biggest_day?.split("-");
    const biggestDay = date ? `${date[1]}/${date[2]}/${date[0]}` : "—";

    if (!recap?.summary?.total_plays) return <EmptyState />;

    return (
        <div className="space-y-6">
            <section className="rounded-xl border border-white/10 bg-mgray p-5 md:p-7">
                <p className="text-sm font-bold text-[var(--color-primary)]">{year} recap</p>
                <h2 className="mt-1 text-2xl font-bold font-metropolis">Your year in music</h2>
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <SummaryCard label="Time listened" value={formatDuration(recap.summary.total_time_ms)} />
                    <SummaryCard label="Plays" value={Number(recap.summary.total_plays).toLocaleString()} />
                    <SummaryCard label="Sessions" value={Number(archive.sessions || 0).toLocaleString()} />
                    <SummaryCard label="Longest session" value={formatDuration(archive.longest_session_ms)} />
                </div>
            </section>

            <section className="rounded-xl border border-white/10 bg-mgray p-5">
                <h2 className="text-lg font-bold font-metropolis">Top artist sprint</h2>
                <p className="mt-1 text-sm text-gray-400">The five artists you returned to most.</p>
                <ol className="mt-4 grid gap-2 md:grid-cols-5">
                    {topArtists.map((item: any, index: number) => {
                        const artist = artistByID.get(item.spotify_id) as any;
                        return (
                            <li key={item.spotify_id}>
                                <Link
                                    href={`/info/artist/${item.spotify_id}`}
                                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-white/5"
                                >
                                    <span className="w-4 text-sm text-gray-500">{index + 1}</span>
                                    <img
                                        src={artist?.images?.[2]?.url || artist?.images?.[0]?.url || "/images/logo.png"}
                                        alt=""
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-bold">
                                            {artist?.name || "Unknown artist"}
                                        </span>
                                        <span className="text-xs text-gray-400">{item.plays} plays</span>
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ol>
            </section>

            <section className="rounded-xl border border-white/10 bg-mgray p-5">
                <h2 className="text-lg font-bold font-metropolis">Music evolution</h2>
                <p className="mt-1 text-sm text-gray-400">Your most-played artist each month.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                    {monthly.map((item: any) => {
                        const artist = artistByID.get(item.spotify_id) as any;
                        return (
                            <div key={item.month} className="rounded-lg border border-white/10 bg-white/[.03] p-3">
                                <p className="text-xs font-bold text-gray-500">{item.month}</p>
                                <p className="mt-2 truncate text-sm font-bold">{artist?.name || "No plays"}</p>
                                <p className="mt-1 text-xs text-gray-400">{item.plays ? `${item.plays} plays` : ""}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-mgray p-5">
                    <h2 className="text-lg font-bold font-metropolis">Listening archive</h2>
                    <div className="mt-4 space-y-3 text-sm">
                        <p className="flex justify-between gap-4">
                            <span className="text-gray-400">Biggest listening day</span>
                            <span className="text-right font-bold">
                                {biggestDay} · {formatDuration(archive.biggest_day_time_ms)}
                            </span>
                        </p>
                        <p className="flex justify-between gap-4">
                            <span className="text-gray-400">Longest session</span>
                            <span className="font-bold">{formatDuration(archive.longest_session_ms)}</span>
                        </p>
                    </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-mgray p-5">
                    <h2 className="text-lg font-bold font-metropolis">Most replayed track</h2>
                    {track ? (
                        <Link
                            href={`/info/track/${track.id}`}
                            className="mt-4 flex items-center gap-3 rounded-lg p-2 hover:bg-white/5"
                        >
                            <img
                                src={track.album?.images?.[0]?.url || "/images/logo.png"}
                                alt=""
                                className="h-12 w-12 rounded object-cover"
                            />
                            <span className="min-w-0">
                                <span className="block truncate font-bold">{track.name}</span>
                                <span className="block truncate text-sm text-gray-400">
                                    {track.artists?.map((artist: any) => artist.name).join(", ")}
                                </span>
                                <span className="text-xs text-[var(--color-primary)]">
                                    {archive.top_track_plays} plays
                                </span>
                            </span>
                        </Link>
                    ) : (
                        <p className="mt-4 text-sm text-gray-400">Loading track details…</p>
                    )}
                </div>
            </section>
        </div>
    );
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

function TopTooltip({ active, payload, sort }: any) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
        <div className="flex min-w-52 gap-3 rounded-lg border border-white/10 bg-[#202020] p-3">
            <img src={item.image || "/images/logo.png"} alt="" className="h-11 w-11 rounded object-cover" />
            <div className="min-w-0">
                <p className="font-bold">{item.name}</p>
                <p className="truncate text-sm text-gray-400">{item.subtitle}</p>
                <p className="mt-2 text-sm text-[var(--color-primary)]">
                    {sort === "time" ? formatDuration(item.total_duration_ms) : `${item.play_count.toLocaleString()} plays`}
                </p>
                <p className="text-xs text-gray-400">
                    {sort === "time" ? `${item.play_count.toLocaleString()} plays` : formatDuration(item.total_duration_ms)}
                </p>
            </div>
        </div>
    );
}

function rankingChange(index: number, previousRank?: number) {
    if (!previousRank) return "New to top 50";
    const change = previousRank - index - 1;
    if (!change) return "Same rank";
    return change > 0 ? `↑ ${change}` : `↓ ${Math.abs(change)}`;
}

function TopRow({ item, index, type, previousRank, hasPrevious }: { item: any; index: number; type: StatType; previousRank?: number; hasPrevious: boolean }) {
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
                    <p className="mt-1 text-[11px] text-gray-500">
                        {item.first_played_at ? `First ${formatDate(item.first_played_at)} · ` : ""}Last {formatDate(item.last_played_at)}
                    </p>
                </div>
                <p className="text-right text-xs text-gray-400 whitespace-nowrap">
                    {item.play_count} plays
                    <br />
                    {formatDuration(item.total_duration_ms)}
                    {hasPrevious ? <><br /><span className="text-[var(--color-primary)]">{rankingChange(index, previousRank)}</span></> : null}
                </p>
            </Link>
        </li>
    );
}

function formatDate(value?: string) {
    return value ? new Date(value).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "—";
}
