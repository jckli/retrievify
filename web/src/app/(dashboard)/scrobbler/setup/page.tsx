"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ScrobblerSetupPage() {
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		bskyHandle: "",
		bskyPass: "",
		bskyPds: "https://bsky.social",
		clientId: "",
		secret: "",
	});

	const handleNext = () => {
		if (!formData.bskyHandle || !formData.bskyPass || !formData.bskyPds) {
			return setError("All Bluesky fields are required to enable PDS dual-writing.");
		}
		setError("");
		setStep(2);
	};

	const handleAuth = () => {
		if (!formData.clientId || !formData.secret) {
			return setError("Spotify API keys are strictly required.");
		}

		localStorage.setItem("byok_bsky_handle", formData.bskyHandle);
		localStorage.setItem("byok_bsky_pass", formData.bskyPass);
		localStorage.setItem("byok_bsky_pds", formData.bskyPds);
		localStorage.setItem("byok_client_id", formData.clientId);
		localStorage.setItem("byok_secret", formData.secret);

		const redirectUri = window.location.origin + "/scrobbler/callback";

		window.location.href = `https://accounts.spotify.com/authorize?client_id=${formData.clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-recently-played`;
	};

	return (
		<div className="max-w-xl mx-auto mt-10 p-4 md:p-8 animate-in fade-in duration-500">
			<Link
				href="/scrobbler"
				className="inline-flex items-center text-gray-400 hover:text-white mb-6 font-bold text-sm transition-colors cursor-pointer"
			>
				<ArrowLeftIcon className="w-4 h-4 mr-2" /> Back to Dashboard
			</Link>

			<div className="bg-[var(--color-mgray)] rounded-3xl border border-white/10 p-8 shadow-2xl">
				<div className="flex items-center justify-between mb-8 relative">
					<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0" />
					<div
						className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-primary)] rounded-full z-0 transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`}
					/>

					<div
						className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-[var(--color-mgray)] ${step >= 1 ? "bg-[var(--color-primary)] text-black" : "bg-gray-700 text-gray-400"}`}
					>
						1
					</div>
					<div
						className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-[var(--color-mgray)] transition-colors duration-300 ${step >= 2 ? "bg-[var(--color-primary)] text-black" : "bg-gray-800 text-gray-400"}`}
					>
						2
					</div>
				</div>

				<h1 className="text-3xl font-metropolis font-bold mb-2">
					{step === 1 ? "Connect your PDS" : "Authorize Spotify"}
				</h1>
				<p className="text-gray-400 text-sm mb-6">
					{step === 1
						? "Configure your decentralized backup layer."
						: "Link your custom API keys to bypass tracking limits."}
				</p>

				{error && (
					<div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm font-bold">
						{error}
					</div>
				)}

				{step === 1 && (
					<div className="space-y-4 animate-in slide-in-from-right-4">
						<div>
							<label className="block text-sm font-bold text-gray-300 mb-1.5">
								Bluesky Handle
							</label>
							<input
								type="text"
								placeholder="e.g., jckli.bsky.social"
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
							className="w-full mt-6 bg-white text-black font-bold p-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer"
						>
							Continue to Spotify <ArrowRightIcon className="w-5 h-5 ml-2" />
						</button>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-4 animate-in slide-in-from-right-4">
						<div>
							<label className="block text-sm font-bold text-gray-300 mb-1.5">
								Spotify Client ID
							</label>
							<input
								type="text"
								placeholder="32-character hex string"
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
								placeholder="32-character hex string"
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

						<div className="flex gap-3 mt-6">
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
		</div>
	);
}
