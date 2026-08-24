"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ScrobblerSetupPage() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");
	const [isWiping, setIsWiping] = useState(false);
	const [historyFile, setHistoryFile] = useState<File | null>(null);
	const [isImporting, setIsImporting] = useState(false);
	const [importResult, setImportResult] = useState<any>(null);
	const [importError, setImportError] = useState("");
	const [formData, setFormData] = useState({
		bskyHandle: "",
		bskyPass: "",
		bskyPds: "https://bsky.social",
		clientId: "",
		secret: "",
	});

	const { data: config } = useSWR("/retrievify/spotify/scrobbler/config", fetcher);

	useEffect(() => {
		if (config?.data) {
			setFormData(prev => ({
				...prev,
				bskyHandle: config.data.bluesky_handle || prev.bskyHandle,
				bskyPds: config.data.bluesky_pds || prev.bskyPds,
				clientId: config.data.spotify_client_id || prev.clientId,
			}));
		}
	}, [config]);

	const handleNext = () => {
		if (!formData.bskyHandle || !formData.bskyPass || !formData.bskyPds)
			return setError("All Bluesky fields are required.");
		setError("");
		setStep(2);
	};

	const handleAuth = () => {
		if (!formData.clientId || !formData.secret) return setError("Spotify API keys are required.");
		localStorage.setItem("byok_bsky_handle", formData.bskyHandle);
		localStorage.setItem("byok_bsky_pass", formData.bskyPass);
		localStorage.setItem("byok_bsky_pds", formData.bskyPds);
		localStorage.setItem("byok_client_id", formData.clientId);
		localStorage.setItem("byok_secret", formData.secret);
		const redirectUri = window.location.origin + "/scrobbler/callback";
		window.location.href = `https://accounts.spotify.com/authorize?client_id=$${formData.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-recently-played`;
	};

	const handleWipe = async () => {
		if (!confirm("Are you entirely sure? This will instantly wipe all scrobbling data from Retrievify."))
			return;
		setIsWiping(true);
		try {
			await fetch("https://gomapi.hayasaka.moe/retrievify/spotify/scrobbler/wipe", {
				method: "DELETE",
				credentials: "include",
			});
			router.push("/scrobbler");
		} catch {
			setError("Failed to wipe data.");
			setIsWiping(false);
		}
	};

	const handleImport = async () => {
		if (!historyFile) return;
		setImportError("");
		setImportResult(null);
		setIsImporting(true);
		try {
			const body = new FormData();
			body.append("file", historyFile);
			const response = await fetch("https://gomapi.hayasaka.moe/retrievify/spotify/scrobbler/import", {
				method: "POST",
				body,
				credentials: "include",
			});
			const text = await response.text();
			let payload: any = {};
			try {
				payload = text ? JSON.parse(text) : {};
			} catch {
				payload = { error: text };
			}
			if (!response.ok) throw new Error(payload.error || "Import failed.");
			setImportResult(payload.data);
			setHistoryFile(null);
		} catch (err: any) {
			setImportError(err.message || "Import failed.");
		} finally {
			setIsImporting(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto mt-10 p-4 md:p-8 animate-in fade-in duration-500">
			<Link
				href="/scrobbler"
				className="inline-flex items-center text-gray-400 hover:text-white mb-6 font-bold text-sm transition-colors cursor-pointer"
			>
				<ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
			</Link>

			<div className="bg-mgray rounded-3xl border border-white/10 p-8 shadow-2xl mb-8">
				<div className="flex items-center justify-between mb-8 relative">
					<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0" />
					<div
						className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] rounded-full z-0 transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`}
					/>
					<div
						className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-mgray ${step >= 1 ? "bg-[var(--color-primary)] text-black" : "bg-[#303030] text-gray-400"}`}
					>
						1
					</div>
					<div
						className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-mgray transition-colors duration-300 ${step >= 2 ? "bg-[var(--color-primary)] text-black" : "bg-[#303030] text-gray-400"}`}
					>
						2
					</div>
				</div>

				<h1 className="text-3xl font-metropolis font-bold mb-2">
					{step === 1 ? "Connect your PDS" : "Authorize Spotify"}
				</h1>
				<p className="text-gray-400 text-sm mb-6 font-proximaNova">
					{step === 1
						? "Configure your decentralized backup layer."
						: "Link your custom API keys to bypass limits."}
				</p>

				{error && (
					<div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm font-bold font-proximaNova">
						{error}
					</div>
				)}

				{step === 1 && (
					<div className="space-y-4 animate-in slide-in-from-right-4 font-proximaNova">
						<div>
							<label className="block text-sm font-bold text-gray-300 mb-1.5">
								Bluesky Handle
							</label>
							<input
								type="text"
								placeholder="e.g., user.bsky.social"
								className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[var(--color-primary)] transition-colors"
								value={formData.bskyHandle}
								onChange={e =>
									setFormData({
										...formData,
										bskyHandle: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-bold text-gray-300 mb-1.5">
								App Password
							</label>
							<input
								type="password"
								placeholder="xxxx-xxxx-xxxx-xxxx"
								className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[var(--color-primary)] transition-colors"
								value={formData.bskyPass}
								onChange={e =>
									setFormData({
										...formData,
										bskyPass: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-bold text-gray-300 mb-1.5">
								PDS URL
							</label>
							<input
								type="text"
								className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-gray-400 outline-none focus:border-[var(--color-primary)] transition-colors"
								value={formData.bskyPds}
								onChange={e =>
									setFormData({
										...formData,
										bskyPds: e.target.value,
									})
								}
							/>
						</div>
						<button
							onClick={handleNext}
							className="w-full mt-6 bg-white text-black font-bold font-metropolis p-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
						>
							Continue to Spotify <ArrowRightIcon className="w-5 h-5 ml-2" />
						</button>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-4 animate-in slide-in-from-right-4 font-proximaNova">
						<div>
							<label className="block text-sm font-bold text-gray-300 mb-1.5">
								Spotify Client ID
							</label>
							<input
								type="text"
								className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[var(--color-primary)] transition-colors"
								value={formData.clientId}
								onChange={e =>
									setFormData({
										...formData,
										clientId: e.target.value,
									})
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-bold text-gray-300 mb-1.5">
								Spotify Client Secret
							</label>
							<input
								type="password"
								placeholder="Your existing secret is hidden for security"
								className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-white outline-none focus:border-[var(--color-primary)] transition-colors"
								value={formData.secret}
								onChange={e =>
									setFormData({
										...formData,
										secret: e.target.value,
									})
								}
							/>
						</div>
						<div className="flex gap-3 mt-6 font-metropolis">
							<button
								onClick={() => setStep(1)}
								className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors cursor-pointer"
							>
								Back
							</button>
							<button
								onClick={handleAuth}
								className="flex-1 bg-[var(--color-primary)] text-black font-bold p-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center shadow-[0_0_20px_rgba(74,211,255,0.2)] cursor-pointer"
							>
								Complete Setup{" "}
								<CheckCircleIcon className="w-5 h-5 ml-2" />
							</button>
						</div>
					</div>
				)}
			</div>

			{config?.data && (
				<div className="mb-8 rounded-3xl border border-white/10 bg-mgray p-6">
					<h3 className="font-bold font-metropolis">Import Spotify history</h3>
					<p className="mt-2 text-sm text-gray-400 font-proximaNova">Upload Spotify’s Extended Streaming History ZIP. Only music played for more than 30 seconds is imported; it stays in Retrievify and is not sent to Teal.</p>
					<div className="mt-4 flex flex-col gap-3 sm:flex-row">
						<input type="file" accept=".zip,application/zip" onChange={event => setHistoryFile(event.target.files?.[0] || null)} className="block min-w-0 flex-1 cursor-pointer text-sm text-gray-400 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-white/15" />
						<button onClick={handleImport} disabled={!historyFile || isImporting} className="cursor-pointer rounded-xl bg-[var(--color-primary)] px-5 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50">{isImporting ? "Importing…" : "Import history"}</button>
					</div>
					{importError && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">{importError}</p>}
					{importResult && <p className="mt-4 text-sm text-green-300">Imported {Number(importResult.imported).toLocaleString()} plays. Skipped {Number(importResult.duplicates).toLocaleString()} duplicates and {Number(importResult.unavailable).toLocaleString()} unavailable tracks.</p>}
				</div>
			)}

			{config?.data && (
				<div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6 text-center">
					<h3 className="text-red-400 font-bold font-metropolis mb-2">Danger Zone</h3>
					<p className="text-sm text-red-400/70 font-proximaNova mb-4">
						This action cannot be undone. All scrobbling history will be permanently
						deleted.
					</p>
					<button
						onClick={handleWipe}
						disabled={isWiping}
						className="inline-flex items-center px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-bold transition-colors cursor-pointer disabled:opacity-50 font-proximaNova"
					>
						{isWiping ? "Erasing Data..." : "Erase Scrobbler History"}
						<TrashIcon className="w-5 h-5 ml-2" />
					</button>
				</div>
			)}
		</div>
	);
}
