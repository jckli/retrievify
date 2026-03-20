"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function PackageUpload() {
	const router = useRouter();
	const fileRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setIsLoading(true);
		setError(null);

		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("https://gomapi.hayasaka.moe/retrievify/package/upload", {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (!res.ok || data.error) {
				throw new Error(data?.error?.message || "Failed to process package");
			}

			localStorage.setItem("songDict", JSON.stringify(data.songDict));
			localStorage.setItem("artistDict", JSON.stringify(data.artistDict));
			localStorage.setItem("firstTime", data.firstTime);
			localStorage.setItem("currentYear", data.currentYear);

			router.push("/package");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center items-center font-metropolis p-8 text-center">
				<input
					type="file"
					className="hidden"
					accept=".zip"
					onChange={handleFile}
					ref={fileRef}
				/>

				<button
					onClick={() => fileRef.current?.click()}
					disabled={isLoading}
					className={`border border-dashed border-[#585858] rounded-md transition hover:bg-[#202020] w-full max-w-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
				>
					<div className="p-10 flex flex-col items-center">
						<FontAwesomeIcon
							icon={faCloudArrowUp}
							size="4x"
							className="text-primary"
						/>
						<h1 className="mt-4 text-3xl">
							{isLoading
								? "Processing Package..."
								: "Import your Spotify data here"}
						</h1>
					</div>
				</button>

				<p className="mt-4 italic text-gray-400">
					You can request your data{" "}
					<a
						href="https://spotify.com/us/account/privacy"
						target="_blank"
						rel="noreferrer"
						className="underline hover:text-primary transition"
					>
						here
					</a>
					.
				</p>

				{error && <h1 className="mt-4 text-red-500 font-bold">{error}</h1>}
			</div>
		</>
	);
}
