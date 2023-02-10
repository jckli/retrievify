import Link from "next/link";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <>
            <div className="h-[10vh] flex justify-center items-center font-metropolis font-normal">
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
                        © 2021 - {currentYear} Retrievify
                    </div>
                </div>
            </div>
        </>
    );
};
