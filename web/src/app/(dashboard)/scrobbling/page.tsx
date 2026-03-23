"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrobblingPage() {
	const [isSetupComplete, setIsSetupComplete] = useState(false);
	const [step, setStep] = useState(1);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [formData, setFormData] = useState({
		spotify_client_id: "",
		spotify_secret: "",
		bluesky_handle: "",
		bluesky_app_pass: "",
		bluesky_pds: "https://bsky.social",
	});

	const handleNext = () => setStep(s => s + 1);
	const handlePrev = () => setStep(s => s - 1);

	const handleSubmit = async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch("https://gomapi.hayasaka.moe/retrievify/spotify/setup-scrobbler", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(formData),
			});

			if (!res.ok) throw new Error("Failed to save configuration.");
			setIsSetupComplete(true);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (isSetupComplete) {
		return (
			<div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
				<header>
					<h1 className="text-4xl font-metropolis font-bold">Your Analytics</h1>
					<p className="text-[var(--color-primary)] mt-2">
						Engine is tracking. Daemon is active.
					</p>
				</header>
				<div className="h-96 border border-white/10 rounded-xl bg-white/5 flex items-center justify-center">
					<p className="text-gray-500 font-proximaNova">
						[ Future Stats Dashboard Rendered Here ]
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="w-full max-w-2xl bg-[var(--color-mgray)] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
				<div className="h-1 w-full bg-black/50 absolute top-0 left-0">
					<motion.div
						className="h-full bg-[var(--color-primary)]"
						initial={{ width: "33%" }}
						animate={{ width: `${(step / 3) * 100}%` }}
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
								<h2 className="text-3xl font-metropolis font-bold mb-4">
									Initialize Engine
								</h2>
								<p className="text-gray-400 mb-8 leading-relaxed">
									To bypass Spotify's strict rate limits and own
									your data, Retrievify uses a Bring-Your-Own-Keys
									(BYOK) architecture. Let's get your background
									daemon configured.
								</p>
								<button
									onClick={handleNext}
									className="w-full py-4 bg-[var(--color-primary)] text-black font-bold rounded-xl hover:scale-[1.02] transition-transform"
								>
									Begin Setup
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
									Create an app in the Spotify Developer Dashboard
									and paste your credentials below.
								</p>

								<div className="space-y-4">
									<div>
										<label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
											Client ID
										</label>
										<input
											type="text"
											className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
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
											className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
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
								<div className="flex space-x-4 mt-8">
									<button
										onClick={handlePrev}
										className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
									>
										Back
									</button>
									<button
										onClick={handleNext}
										className="flex-1 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
									>
										Next Step
									</button>
								</div>
							</motion.div>
						)}

						{step === 3 && (
							<motion.div
								key="step3"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
							>
								<h2 className="text-2xl font-bold mb-2">
									AT Protocol Sync
								</h2>
								<p className="text-sm text-gray-500 mb-6">
									Configure where Retrievify pushes your listening
									history on the decentralized web.
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
											placeholder="sakuta.bsky.social"
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
										onClick={handleSubmit}
										disabled={loading}
										className="flex-1 bg-[var(--color-primary)] text-black font-bold rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
									>
										{loading
											? "Igniting Daemon..."
											: "Complete Setup"}
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
