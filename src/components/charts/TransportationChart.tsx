import { ObesityData } from "@/types/obesity";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OBESITY_LEVEL_LABELS, OBESITY_COLORS } from "@/types/obesity";

interface TransportationChartProps {
  data: ObesityData[];
}

const TRANSPORT_LABELS: Record<string, string> = {
  Public_Transportation: "Public Transit",
  Automobile: "Car",
  Walking: "Walking",
  Bike: "Bike",
  Motorbike: "Motorbike",
};

export const TransportationChart = ({ data }: TransportationChartProps) => {
  const transportModes = Array.from(new Set(data.map((d) => d.MTRANS)));
  
  const chartData = transportModes.map((mode) => {
    const modeData = data.filter((d) => d.MTRANS === mode);
    const obesityCounts = modeData.reduce((acc, record) => {
      const level = record.NObeyesdad;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      mode: TRANSPORT_LABELS[mode] || mode,
      ...obesityCounts,
    };
  });

  const obesityLevels = Array.from(
    new Set(data.map((d) => d.NObeyesdad))
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="mode" />
        <YAxis />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        {obesityLevels.map((level) => (
          <Bar
            key={level}
            dataKey={level}
            name={OBESITY_LEVEL_LABELS[level] || level}
            fill={OBESITY_COLORS[level]}
            stackId="a"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
