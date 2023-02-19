import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Label, ReferenceLine } from "recharts";

export const ObscureChart = (props: any) => {
    let dataArray: any[] = [];
    Object.keys(props.data.breakdown).map(function (index) {
        if (Number(props.data.breakdown[index].N) > 0) {
            dataArray.push({ N: Number(props.data.breakdown[index].N), you: 0 });
        }
    });
    dataArray.reverse();

    let count = 0;
    let currentIndex = "";
    let allTimeIndex = "";
    for (const key in dataArray) {
        count += dataArray[key].N;
        if (
            count >= props.data.userCountByCountry * (props.data.percentileByCountryRecent / 100) &&
            currentIndex == ""
        ) {
            currentIndex = key;
        }
        if (
            count >= props.data.userCountByCountry * (props.data.percentileByCountryAllTime / 100) &&
            allTimeIndex == ""
        ) {
            allTimeIndex = key;
        }
    }
    dataArray[Number(currentIndex)].you = 1;
    dataArray[Number(allTimeIndex)].you = 2;

    let max = Math.max(...dataArray.map(obj => obj.N));
    let threshold = 0.01 * max;
    let filtered = dataArray.filter(obj => obj.N >= threshold);

    var currentLineIndex = -1;
    var allTimeLineIndex = -1;
    for (let i = 0; i < filtered.length; i++) {
        if (filtered[i].you == 1) {
            currentLineIndex = i;
        } else if (filtered[i].you == 2) {
            allTimeLineIndex = i;
        }
    }
    if (currentLineIndex == -1) {
        currentLineIndex = filtered.length - 1;
    }
    if (allTimeLineIndex == -1) {
        allTimeLineIndex = filtered.length - 1;
    }

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
                    <ReferenceLine x={currentLineIndex} label="Max" stroke="red" strokeDasharray="3 3" />
                    <ReferenceLine x={allTimeLineIndex} label="Max" stroke="red" strokeDasharray="3 3" />
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
