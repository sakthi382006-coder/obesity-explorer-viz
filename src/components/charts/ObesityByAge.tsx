import { ObesityData } from "@/types/obesity";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OBESITY_LEVEL_LABELS, OBESITY_COLORS } from "@/types/obesity";
import { getAgeBand } from "@/utils/dataProcessing";

interface ObesityByAgeProps {
  data: ObesityData[];
}

export const ObesityByAge = ({ data }: ObesityByAgeProps) => {
  const dataWithAgeBand = data.map((d) => ({
    ...d,
    ageBand: getAgeBand(d.Age),
  }));

  const ageBands = ["Under 20", "20-29", "30-39", "40-49", "50-59", "60+"];
  
  const chartData = ageBands.map((band) => {
    const bandData = dataWithAgeBand.filter((d) => d.ageBand === band);
    const obesityCounts = bandData.reduce((acc, record) => {
      const level = record.NObeyesdad;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      ageBand: band,
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
        <XAxis dataKey="ageBand" />
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
