import { ObesityData } from "@/types/obesity";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface FamilyHistoryChartProps {
  data: ObesityData[];
}

const COLORS = {
  yes: "hsl(var(--chart-6))",
  no: "hsl(var(--chart-1))",
};

export const FamilyHistoryChart = ({ data }: FamilyHistoryChartProps) => {
  const counts = data.reduce((acc, record) => {
    const history = record.family_history_with_overweight;
    acc[history] = (acc[history] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(counts).map(([name, value]) => ({
    name: name === "yes" ? "Family History: Yes" : "Family History: No",
    value,
    fill: COLORS[name as keyof typeof COLORS],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
