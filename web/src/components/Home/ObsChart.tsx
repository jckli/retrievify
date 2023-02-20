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

    const allTimeLabel = (a: any) => (
        <g>
            <foreignObject x={a.viewBox.x - 60} y={a.viewBox.y + 70} width={120} height={100}>
                <div className="bg-black opacity-70 rounded-lg z-50">
                    <div className="p-1 flex items-center justify-center">
                        <p className="text-[11px]">
                            Your All Time {Math.floor(props.data.percentileByCountryAllTime)}%
                        </p>
                    </div>
                </div>
            </foreignObject>
        </g>
    );

    const currentLabel = (a: any) => (
        <g>
            <foreignObject x={a.viewBox.x - 60} y={a.viewBox.y + 30} width={120} height={100}>
                <div className="bg-black opacity-80 rounded-lg z-50">
                    <div className="p-1 flex items-center justify-center">
                        <p className="text-[11px] opacity-90">
                            Your Current {Math.floor(props.data.percentileByCountryRecent)}%
                        </p>
                    </div>
                </div>
            </foreignObject>
        </g>
    );

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
                    <ReferenceLine
                        x={allTimeLineIndex}
                        label={allTimeLabel}
                        stroke="#ff8c00"
                        strokeWidth={2}
                        isFront={false}
                    />
                    <ReferenceLine x={currentLineIndex} label={currentLabel} stroke="#005b9f" strokeWidth={2} />
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
