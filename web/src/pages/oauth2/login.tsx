import crypto from "crypto";
import { setCookie } from "cookies-next";

const Login = () => {
    return <></>;
};

export async function getServerSideProps(ctx: any) {
    const token = crypto.randomBytes(16).toString("hex");
    setCookie("state", token, { req: ctx.req, res: ctx.res });
    const authorize_url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}&state=${token}`;
    return {
        redirect: {
            destination: authorize_url,
            permanent: false,
        },
    };
}

export default Login;
