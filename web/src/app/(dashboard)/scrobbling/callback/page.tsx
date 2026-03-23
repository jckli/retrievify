"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function CallbackProcessor() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [status, setStatus] = useState("Assembling keys...");

	useEffect(() => {
		const code = searchParams.get("code");
		if (!code) {
			setStatus("Authentication failed. No code provided.");
			return;
		}

		const executeSetup = async () => {
			try {
				setStatus("Negotiating with Daemon...");
				const payload = {
					spotify_code: code,
					redirect_uri: window.location.origin + "/scrobbling/callback",
					bluesky_handle: localStorage.getItem("byok_bsky_handle") || "",
					bluesky_app_pass: localStorage.getItem("byok_bsky_pass") || "",
					bluesky_pds: localStorage.getItem("byok_bsky_pds") || "https://bsky.social",
					spotify_client_id: localStorage.getItem("byok_client_id") || "",
					spotify_secret: localStorage.getItem("byok_secret") || "",
				};

				// 2. Fire to the Go Gateway
				const res = await fetch(
					"https://gomapi.hayasaka.moe/retrievify/spotify/setup-scrobbler",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
						body: JSON.stringify(payload),
					},
				);

				if (!res.ok) throw new Error("Backend synchronization failed.");

				localStorage.clear();

				setStatus("Engine active. Redirecting...");
				router.push("/scrobbling");
			} catch (err: any) {
				setStatus(err.message);
			}
		};

		executeSetup();
	}, [searchParams, router]);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="text-center space-y-4 animate-pulse">
				<div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
				<h2 className="text-xl font-metropolis font-bold text-[var(--color-primary)]">
					{status}
				</h2>
			</div>
		</div>
	);
}

export default function ScrobblingCallbackPage() {
	return (
		<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
			<CallbackProcessor />
		</Suspense>
	);
}
