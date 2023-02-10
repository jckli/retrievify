import type { NextPage } from "next";
import Image from "next/image";
import { MainButton } from "../components/MainButton";
import { Footer } from "../components/Footer";

const Index: NextPage = () => {
    return (
        <>
            <div className="w-full h-[90vh] flex flex-col items-center justify-center text-white text-3xl font-semibold text-center">
                <div className="px-[40px] mx-auto max-w-[750px]">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="relative h-[128px] w-[128px]">
                            <Image alt="statsifyLogo" draggable={false} src="/images/logo.png" layout="fill" />
                        </div>
                        <h1 className="text-primary font-proximaNova text-7xl md:text-8xl font-bold">Retrievify</h1>
                    </div>
                    <p className="mt-6 font-metropolis text-base sm:text-lg font-normal block">
                        Get insights into all your listening statistics and see how you&apos;ve spent your time
                        listening to music with Retrievify.
                    </p>
                    <MainButton text="Login" href="/oauth2/login" />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Index;
