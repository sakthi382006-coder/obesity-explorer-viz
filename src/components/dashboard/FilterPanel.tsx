import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterState } from "@/types/obesity";
import { Filter } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const handleCheckboxChange = (
    category: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[category];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    
    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const FilterSection = ({
    title,
    category,
    options,
  }: {
    title: string;
    category: keyof FilterState;
    options: string[];
  }) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${option}`}
              checked={filters[category].includes(option)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(category, option, checked as boolean)
              }
            />
            <Label
              htmlFor={`${category}-${option}`}
              className="text-sm cursor-pointer"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
        <CardDescription>Refine your analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FilterSection
          title="Gender"
          category="gender"
          options={["Male", "Female"]}
        />
        <FilterSection
          title="Age Band"
          category="ageBand"
          options={["Under 20", "20-29", "30-39", "40-49", "50-59", "60+"]}
        />
        <FilterSection
          title="Family History"
          category="familyHistory"
          options={["yes", "no"]}
        />
        <FilterSection
          title="High-Calorie Food"
          category="favc"
          options={["yes", "no"]}
        />
        <FilterSection
          title="Physical Activity"
          category="faf"
          options={["No Activity", "Low (0-1)", "Moderate (1-2)", "High (2+)"]}
        />
        <FilterSection
          title="Alcohol Consumption"
          category="calc"
          options={["no", "Sometimes", "Frequently", "Always"]}
        />
      </CardContent>
    </Card>
  );
};
