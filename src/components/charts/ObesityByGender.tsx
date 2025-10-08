import { ObesityData } from "@/types/obesity";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OBESITY_LEVEL_LABELS, OBESITY_COLORS } from "@/types/obesity";
import { groupByField } from "@/utils/dataProcessing";

interface ObesityByGenderProps {
  data: ObesityData[];
}

export const ObesityByGender = ({ data }: ObesityByGenderProps) => {
  const groupedByGender = groupByField(data, "Gender");
  
  const chartData = Object.entries(groupedByGender).map(([gender, records]) => {
    const obesityCounts = records.reduce((acc, record) => {
      const level = record.NObeyesdad;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      gender,
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
        <XAxis dataKey="gender" />
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
