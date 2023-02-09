import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Label } from "recharts";

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
                <BarChart data={filtered} margin={{ left: 20, top: 20 }}>
                    <XAxis tick={false}>
                        <Label value="More Obscure Taste ->" />
                    </XAxis>
                    <YAxis tickCount={6}>
                        <Label angle={-90} value="Users" position="left" offset={15} style={{ textAnchor: "middle" }} />
                    </YAxis>
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
