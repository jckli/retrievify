import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Sidebar } from "../../components/Sidebar";

const Home: NextPage = () => {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const importButton = async (event: any) => {
        event.preventDefault();
        fileRef.current?.click();
    };
    const handleFile = async (event: any) => {
        event.preventDefault();
        const file = event.target.files[0];
        const url = "/api/package/upload";

        const formData = new FormData();
        formData.append("file", file);
        const resp: any = await fetch(url, {
            method: "POST",
            body: formData,
            cache: "no-cache",
        })
            .then(res => res.json())
            .then(data => {
                return data;
            });
        localStorage.setItem("songDict", JSON.stringify(resp.songDict));
        localStorage.setItem("artistDict", JSON.stringify(resp.artistDict));
        localStorage.setItem("firstTime", resp.firstTime);
        localStorage.setItem("currentYear", resp.currentYear);
        router.push("/package/overview");
    };

    return (
        <>
            <Sidebar active={2} />
            <div className="navbar:ml-[280px] flex font-metropolis text-white h-[100vh]">
                <input
                    type="file"
                    className="hidden"
                    id="file"
                    onChange={handleFile}
                    name="Input your Spotify package"
                    ref={fileRef}
                />
                <div className="m-8 flex flex-col justify-center items-center w-[100%]">
                    <button onClick={importButton}>
                        <div className="border border-dashed border-[#585858] rounded-md">
                            <div className="p-5 flex flex-col justify-center text-center">
                                <FontAwesomeIcon icon={faCloudArrowUp} size="4x" className="text-primary" />
                                <h1 className="mt-2 text-3xl">Import your Spotify data here</h1>
                            </div>
                        </div>
                    </button>
                    <h1 className="mt-2">
                        <i>
                            You can request your data{" "}
                            <a href="https://spotify.com/us/account/privacy" className="underline underline-offset-2">
                                here
                            </a>
                            .
                        </i>
                    </h1>
                </div>
            </div>
        </>
    );
};

export default Home;
