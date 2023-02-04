import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import { Sidebar } from "../../components/Sidebar";
import { PackagePDropdown } from "../../components/PackagePDropdown";

const PackageOverview: NextPage = () => {
    const router: NextRouter = useRouter();
    const [period, setPeriod] = useState("package");

    var convTotalTime = "";
    if (typeof window !== "undefined") {
        if (localStorage.getItem("songDict") === null) {
            router.push("/package");
        }
        const songjson: any = JSON.parse(localStorage.getItem("songDict") || "{}");
        console.log(songjson);
        var totalTime = 0;
        for (const time in songjson?.Total.All) {
            totalTime += songjson?.Total.All[time];
        }
        convTotalTime = msToTime(totalTime);
    }

    return (
        <>
            <Sidebar active={2} />
            <div className="navbar:ml-[280px] flex font-metropolis text-white">
                <div className="m-8 flex flex-col 1.5xl:flex-row">
                    <div className="1.5xl:w-[50%] flex flex-col">
                        <div id="time-total" className="bg-mgray rounded-md 1.5xl:min-w-[50%] h-fit">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <h1 className="font-proximaNova text-3xl">Total Time Listened</h1>
                                    <div className="ml-2">
                                        <PackagePDropdown setPeriod={setPeriod} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h1 className="text-5xl font-bold">{convTotalTime}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PackageOverview;

function msToTime(milliseconds: number) {
    let seconds = milliseconds / 1000;
    const hours = Math.floor(seconds / 3600);
    seconds = seconds % 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${hours} hrs, ${minutes} mins, ${seconds} secs`;
}
