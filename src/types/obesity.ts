export interface ObesityData {
  Gender: string;
  Age: number;
  Height: number;
  Weight: number;
  family_history_with_overweight: string;
  FAVC: string;
  FCVC: number;
  NCP: number;
  CAEC: string;
  SMOKE: string;
  CH2O: number;
  SCC: string;
  FAF: number;
  TUE: number;
  CALC: string;
  MTRANS: string;
  NObeyesdad: string;
}

export interface FilterState {
  gender: string[];
  ageBand: string[];
  familyHistory: string[];
  favc: string[];
  faf: string[];
  calc: string[];
}

export const OBESITY_LEVELS = [
  "Insufficient_Weight",
  "Normal_Weight",
  "Overweight_Level_I",
  "Overweight_Level_II",
  "Obesity_Type_I",
  "Obesity_Type_II",
  "Obesity_Type_III",
] as const;

export const OBESITY_LEVEL_LABELS: Record<string, string> = {
  Insufficient_Weight: "Insufficient Weight",
  Normal_Weight: "Normal Weight",
  Overweight_Level_I: "Overweight I",
  Overweight_Level_II: "Overweight II",
  Obesity_Type_I: "Obesity I",
  Obesity_Type_II: "Obesity II",
  Obesity_Type_III: "Obesity III",
};

export const OBESITY_COLORS: Record<string, string> = {
  Insufficient_Weight: "hsl(var(--chart-1))",
  Normal_Weight: "hsl(var(--chart-2))",
  Overweight_Level_I: "hsl(var(--chart-3))",
  Overweight_Level_II: "hsl(var(--chart-4))",
  Obesity_Type_I: "hsl(var(--chart-5))",
  Obesity_Type_II: "hsl(var(--chart-6))",
  Obesity_Type_III: "hsl(0 84% 50%)",
};
