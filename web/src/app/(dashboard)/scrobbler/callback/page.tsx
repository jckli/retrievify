"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CallbackProcessor() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState("Authenticating keys...");

	useEffect(() => {
		const code = searchParams.get("code");
		if (!code) return setStatus("Setup failed. No code provided.");

		const executeSetup = async () => {
			try {
				const res = await fetch(
					"https://gomapi.hayasaka.moe/retrievify/spotify/scrobbler/setup",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify({
							spotify_code: code,
							redirect_uri: window.location.origin + "/scrobbler/callback",
							bluesky_handle: localStorage.getItem("byok_bsky_handle") || "",
							bluesky_app_pass: localStorage.getItem("byok_bsky_pass") || "",
							bluesky_pds:
								localStorage.getItem("byok_bsky_pds") ||
								"https://bsky.social",
							spotify_client_id: localStorage.getItem("byok_client_id") || "",
							spotify_secret: localStorage.getItem("byok_secret") || "",
						}),
					},
				);

				if (!res.ok) throw new Error("Configuration sync failed.");

				localStorage.clear();
				router.push("/scrobbler");
			} catch (err: any) {
				setStatus(err.message);
			}
		};

		executeSetup();
	}, [searchParams, router]);

	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center animate-pulse">
			<div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mb-4" />
			<h2 className="text-xl font-bold font-metropolis text-gray-300">{status}</h2>
		</div>
	);
}

export default function ScrobblerCallbackPage() {
	return (
		<Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
			<CallbackProcessor />
		</Suspense>
	);
}
