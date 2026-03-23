"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrobblingSetupPage() {
	const [step, setStep] = useState(1);
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		bluesky_handle: "",
		bluesky_app_pass: "",
		bluesky_pds: "https://bsky.social",
		spotify_client_id: "",
		spotify_secret: "",
	});

	const handleNext = () => setStep(s => s + 1);
	const handlePrev = () => setStep(s => s - 1);

	const handleSpotifyAuth = () => {
		if (!formData.spotify_client_id || !formData.spotify_secret) {
			setError("Please enter both Spotify developer keys.");
			return;
		}

		// 1. Commit all setup data to local storage before the browser leaves the page
		localStorage.setItem("byok_bsky_handle", formData.bluesky_handle);
		localStorage.setItem("byok_bsky_pass", formData.bluesky_app_pass);
		localStorage.setItem("byok_bsky_pds", formData.bluesky_pds);
		localStorage.setItem("byok_client_id", formData.spotify_client_id);
		localStorage.setItem("byok_secret", formData.spotify_secret);

		// 2. Fire the Redirect to Spotify (Targeting our new callback route)
		const redirectUri = window.location.origin + "/scrobbling/callback";
		const authUrl = `https://accounts.spotify.com/authorize?client_id=${formData.spotify_client_id}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-recently-played`;

		window.location.href = authUrl;
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-2xl bg-[var(--color-mgray)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
				<div className="h-1 w-full bg-black/50 absolute top-0 left-0">
					<motion.div
						className="h-full bg-[var(--color-primary)]"
						initial={{ width: "50%" }}
						animate={{ width: `${(step / 2) * 100}%` }}
						transition={{ duration: 0.3 }}
					/>
				</div>

				<div className="p-8 sm:p-12">
					<AnimatePresence mode="wait">
						{step === 1 && (
							<motion.div
								key="step1"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
							>
								<h2 className="text-2xl font-bold mb-2">
									AT Protocol Sync
								</h2>
								<p className="text-sm text-gray-500 mb-6">
									First, configure where Retrievify pushes your
									listening history on the decentralized web.
								</p>

								<div className="space-y-4">
									<div>
										<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
											Bluesky Handle
										</label>
										<input
											type="text"
											className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)]"
											value={formData.bluesky_handle}
											onChange={e =>
												setFormData({
													...formData,
													bluesky_handle:
														e.target
															.value,
												})
											}
											placeholder="e.g. sakuta.bsky.social"
										/>
									</div>
									<div>
										<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
											App Password
										</label>
										<input
											type="password"
											className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)]"
											value={
												formData.bluesky_app_pass
											}
											onChange={e =>
												setFormData({
													...formData,
													bluesky_app_pass:
														e.target
															.value,
												})
											}
											placeholder="xxxx-xxxx-xxxx-xxxx"
										/>
									</div>
									<div>
										<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
											PDS URL
										</label>
										<input
											type="text"
											className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)]"
											value={formData.bluesky_pds}
											onChange={e =>
												setFormData({
													...formData,
													bluesky_pds:
														e.target
															.value,
												})
											}
										/>
									</div>
								</div>
								<button
									onClick={handleNext}
									className="w-full mt-8 py-4 bg-[var(--color-primary)] text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
								>
									Next: Spotify Keys
								</button>
							</motion.div>
						)}

						{step === 2 && (
							<motion.div
								key="step2"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
							>
								<h2 className="text-2xl font-bold mb-2">
									Spotify Developer Keys
								</h2>
								<p className="text-sm text-gray-500 mb-6">
									Enter your custom Spotify App credentials.
									Ensure your Redirect URI is set exactly to:{" "}
									<br />
									<code className="text-[var(--color-primary)] select-all">
										{typeof window !== "undefined"
											? window.location.origin +
												"/scrobbling/callback"
											: ""}
									</code>
								</p>

								<div className="space-y-4">
									<div>
										<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
											Client ID
										</label>
										<input
											type="text"
											className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)]"
											value={
												formData.spotify_client_id
											}
											onChange={e =>
												setFormData({
													...formData,
													spotify_client_id:
														e.target
															.value,
												})
											}
											placeholder="e.g. 8a4b..."
										/>
									</div>
									<div>
										<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
											Client Secret
										</label>
										<input
											type="password"
											className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)]"
											value={formData.spotify_secret}
											onChange={e =>
												setFormData({
													...formData,
													spotify_secret:
														e.target
															.value,
												})
											}
											placeholder="••••••••••••••••"
										/>
									</div>
								</div>
								{error && (
									<p className="text-red-400 text-sm mt-4">
										{error}
									</p>
								)}
								<div className="flex space-x-4 mt-8">
									<button
										onClick={handlePrev}
										className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
									>
										Back
									</button>
									<button
										onClick={handleSpotifyAuth}
										className="flex-1 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
									>
										Authorize App
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
