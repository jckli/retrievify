import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export const ObscureChart = (props: any) => {
    let dataArray: any[] = [];
    Object.keys(props.data).map(function (index) {
        if (Number(props.data[index].N) > 0) {
            dataArray.push({ N: Number(props.data[index].N) });
        }
    });
    dataArray.reverse();
    let max = Math.max(...dataArray.map(obj => obj.N));
    let threshold = 0.01 * max;
    let filtered = dataArray.filter(obj => obj.N >= threshold);
    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filtered}>
                    <XAxis label="More Obscure Taste ->" tick={false} />
                    <YAxis tickCount={6} />
                    <Bar dataKey="N" fill="#4ad3ff" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

function splitArray(arr: number[]): number[] {
    const startIndex = Math.floor((arr.length - 200) / 2);
    const endIndex = startIndex + 200;
    return arr.slice(startIndex, endIndex);
}
