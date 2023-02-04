import { getCookie, setCookie, deleteCookie } from "cookies-next";

const Login = () => {
    return <></>;
};

const get_token = async (code: string) => {
    const url = "https://accounts.spotify.com/api/token";
    const auth = Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
        "binary"
    ).toString("base64");
    const headers = {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
    };
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.REDIRECT_URI}`;
    const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: new URLSearchParams(body),
    });
    return response.status == 200 ? response.json() : null;
};

export async function getServerSideProps(ctx: any) {
    const state = getCookie("state", { req: ctx.req, res: ctx.res });
    if (state != ctx.query.state) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    deleteCookie("state", { req: ctx.req, res: ctx.res });
    const token_data = await get_token(ctx.query.code);
    if (token_data == null || token_data.error) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    setCookie("acct", token_data.access_token, { req: ctx.req, res: ctx.res, maxAge: token_data.expires_in });
    setCookie("reft", token_data.refresh_token, { req: ctx.req, res: ctx.res });
    return {
        redirect: {
            destination: "/home",
            permanent: false,
        },
    };
}
export default Login;
