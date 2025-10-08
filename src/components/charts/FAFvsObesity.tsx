import { ObesityData } from "@/types/obesity";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts";
import { OBESITY_COLORS } from "@/types/obesity";

interface FAFvsObesityProps {
  data: ObesityData[];
}

export const FAFvsObesity = ({ data }: FAFvsObesityProps) => {
  const chartData = data.map((record) => ({
    faf: record.FAF,
    weight: record.Weight,
    obesity: record.NObeyesdad,
    fill: OBESITY_COLORS[record.NObeyesdad],
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          type="number" 
          dataKey="faf" 
          name="Physical Activity Frequency" 
          label={{ value: "Physical Activity (days/week)", position: "insideBottom", offset: -10 }}
        />
        <YAxis 
          type="number" 
          dataKey="weight" 
          name="Weight" 
          label={{ value: "Weight (kg)", angle: -90, position: "insideLeft" }}
        />
        <ZAxis range={[50, 200]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
          content={({ payload }) => {
            if (payload && payload.length > 0) {
              const data = payload[0].payload;
              return (
                <div className="bg-card p-3 border rounded-lg shadow-lg">
                  <p className="font-semibold">{data.obesity.replace(/_/g, " ")}</p>
                  <p className="text-sm">Activity: {data.faf} days/week</p>
                  <p className="text-sm">Weight: {data.weight} kg</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter name="Individuals" data={chartData} fill="hsl(var(--primary))" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
