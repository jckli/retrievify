import type { NextPage } from "next";
import { Sidebar } from "../../components/Sidebar";

const PackageOverview: NextPage = () => {
    return (
        <>
            <Sidebar active={2} />
            <div className="navbar:ml-[280px] flex font-metropolis text-white"></div>
        </>
    );
};

export default PackageOverview;
