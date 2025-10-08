import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterState } from "@/types/obesity";
import { Filter, X } from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const handleBadgeClick = (
    category: keyof FilterState,
    value: string
  ) => {
    const currentValues = filters[category];
    const isSelected = currentValues.includes(value);
    const newValues = isSelected
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    
    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  const handleReset = () => {
    onFilterChange({
      gender: [],
      ageBand: [],
      familyHistory: [],
      favc: [],
      faf: [],
      calc: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some((f) => f.length > 0);

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
      <h3 className="font-semibold text-sm text-foreground/80 uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = filters[category].includes(option);
          return (
            <Badge
              key={option}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                isSelected 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-primary/10 hover:border-primary/50"
              }`}
              onClick={() => handleBadgeClick(category, option)}
            >
              {option}
            </Badge>
          );
        })}
      </div>
    </div>
  );

  return (
    <Card className="glass-card shadow-glass sticky top-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Filter className="h-5 w-5 text-primary" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
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
