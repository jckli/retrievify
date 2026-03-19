import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Label, ReferenceLine } from "recharts";

export const ObscureChart = ({ data }: any) => {
	const rawData = Object.values(data.breakdown)
		.map((val: any) => Number(val.N))
		.filter(n => n > 0)
		.reverse();

	const threshold = Math.max(...rawData) * 0.01;
	const targetRecent = data.userCountByCountry * (data.percentileByCountryRecent / 100);
	const targetAllTime = data.userCountByCountry * (data.percentileByCountryAllTime / 100);

	let count = 0,
		idxRecent = -1,
		idxAllTime = -1;
	const filtered = rawData.reduce(
		(acc, N) => {
			count += N;
			if (N >= threshold) {
				acc.push({ N });
				if (count >= targetRecent && idxRecent === -1) idxRecent = acc.length - 1;
				if (count >= targetAllTime && idxAllTime === -1) idxAllTime = acc.length - 1;
			}
			return acc;
		},
		[] as { N: number }[],
	);

	idxRecent = idxRecent === -1 ? filtered.length - 1 : idxRecent;
	idxAllTime = idxAllTime === -1 ? filtered.length - 1 : idxAllTime;

	const CustomLabel = ({ viewBox, text, yOffset }: any) => (
		<foreignObject x={viewBox.x - 60} y={viewBox.y + yOffset} width={120} height={100}>
			<div className="bg-black/80 rounded-lg z-50 p-1 flex justify-center text-center">
				<p className="text-[11px] text-white opacity-90">{text}</p>
			</div>
		</foreignObject>
	);

	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={filtered} margin={{ left: 20, top: 20 }}>
				<XAxis tick={false}>
					<Label value="More Obscure Taste ->" />
				</XAxis>
				<YAxis tickCount={6}>
					<Label
						angle={-90}
						value="Users"
						position="left"
						offset={15}
						style={{ textAnchor: "middle" }}
					/>
				</YAxis>
				<Bar dataKey="N" fill="#4ad3ff" />
				<ReferenceLine
					x={idxAllTime}
					stroke="#ff8c00"
					strokeWidth={2}
					label={p => (
						<CustomLabel
							{...p}
							text={`Your All Time ${Math.floor(data.percentileByCountryAllTime)}%`}
							yOffset={70}
						/>
					)}
				/>
				<ReferenceLine
					x={idxRecent}
					stroke="#005b9f"
					strokeWidth={2}
					label={p => (
						<CustomLabel
							{...p}
							text={`Your Current ${Math.floor(data.percentileByCountryRecent)}%`}
							yOffset={30}
						/>
					)}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};
