import type { NextPage } from "next";
import { Sidebar } from "../components/Sidebar";

const Home: NextPage = () => {
    return (
        <>
            <Sidebar active={1} />
        </>
    );
};

export default Home;
