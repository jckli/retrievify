import type { NextPage } from "next";
import Image from "next/image";
import { MainButton } from "../components/MainButton";
import Link from "next/link";

const Home: NextPage = () => {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <div className="w-full h-[90vh] flex flex-col items-center justify-center text-white text-3xl font-semibold text-center">
                <div className="px-[40px] mx-auto max-w-[750px]">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="relative h-[128px] w-[128px]">
                            <Image alt="statsifyLogo" draggable={false} src="/img/logo.png" layout="fill" />
                        </div>
                        <h1 className="text-primary font-proximaNova text-7xl md:text-9xl font-bold">Statsify</h1>
                    </div>
                    <p className="mt-6 font-gotham text-base sm:text-lg font-normal block">
                        View all your listening statistics and see how you&apos;ve spent your time listening to music
                        with Statsify.
                    </p>
                    <MainButton text="Login" href="/api/login" />
                </div>
            </div>
            <div className="h-[10vh] flex justify-center items-center font-gotham font-normal">
                <div className="text-white flex flex-col md:flex-row justify-between items-center xl:w-[1140px] lg:w-[930px] md:w-[720px] sm:w-[530px]">
                    <div className="inline-block">
                        Made with ❤️ by{" "}
                        <a className="inline-block" href="https://github.com/jckli">
                            jckli
                        </a>{" "}
                        &{" "}
                        <a className="inline-block" href="https://github.com/The-Brandon-Tran">
                            BTrident
                        </a>
                        .
                    </div>
                    <div>
                        <Link href="/privacy">
                            <a className="text-[#808080] mr-2 underline underline-offset-2 decoration-2 decoration-[#808080] inline-block">
                                Privacy Policy
                            </a>
                        </Link>
                        © 2021 - {currentYear} Statsify
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
