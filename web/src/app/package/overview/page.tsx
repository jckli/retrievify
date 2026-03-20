"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { PackagePDropdown } from "@/components/PackagePDropdown";

export default function PackageOverview() {
	const router = useRouter();
	const [period, setPeriod] = useState("package");
	const [totalTimeStr, setTotalTimeStr] = useState("Loading...");

	useEffect(() => {
		const rawDict = localStorage.getItem("songDict");
		if (!rawDict) {
			router.push("/package");
			return;
		}

		try {
			const songjson = JSON.parse(rawDict);

			const totalMs = Object.values(songjson?.Total?.All || {}).reduce(
				(acc: number, curr: any) => acc + curr,
				0,
			);

			setTotalTimeStr(msToTime(totalMs));
		} catch (e) {
			console.error("Failed to parse local package data", e);
			localStorage.clear();
			router.push("/package");
		}
	}, [router, period]);

	return (
		<div className="flex font-metropolis text-white bg-[#101010] min-h-screen">
			<Sidebar active={2} />
			<div className="navbar:ml-[280px] m-8 flex flex-col xxl:flex-row w-full">
				<div className="xxl:w-[50%] flex flex-col">
					<div className="bg-mgray rounded-md xxl:min-w-[50%] p-5">
						<div className="flex items-center">
							<h1 className="font-proximaNova text-3xl">
								Total Time Listened
							</h1>
							<div className="ml-4">
								<PackagePDropdown setPeriod={setPeriod} />
							</div>
						</div>
						<div className="mt-6">
							<h1 className="text-5xl font-bold text-primary">
								{totalTimeStr}
							</h1>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function msToTime(ms: number) {
	const totalSecs = Math.floor(ms / 1000);
	const h = Math.floor(totalSecs / 3600);
	const m = Math.floor((totalSecs % 3600) / 60);
	const s = totalSecs % 60;
	return `${h} hrs, ${m} mins, ${s} secs`;
}
