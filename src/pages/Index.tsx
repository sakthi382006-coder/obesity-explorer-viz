import { useState, useEffect, useRef } from "react";
import { parseCSV, applyFilters } from "@/utils/dataProcessing";
import { ObesityData, FilterState } from "@/types/obesity";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { ObesityByGender } from "@/components/charts/ObesityByGender";
import { FamilyHistoryChart } from "@/components/charts/FamilyHistoryChart";
import { ObesityByAge } from "@/components/charts/ObesityByAge";
import { FAVCvsObesity } from "@/components/charts/FAVCvsObesity";
import { FAFvsObesity } from "@/components/charts/FAFvsObesity";
import { TransportationChart } from "@/components/charts/TransportationChart";
import { Activity, TrendingUp, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [rawData, setRawData] = useState<ObesityData[]>([]);
  const [filteredData, setFilteredData] = useState<ObesityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    gender: [],
    ageBand: [],
    familyHistory: [],
    favc: [],
    faf: [],
    calc: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsed = parseCSV(csvText);
        setRawData(parsed);
        setFilteredData(parsed);
        toast({
          title: "Data loaded successfully",
          description: `Loaded ${parsed.length} records from ${file.name}`,
        });
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast({
          title: "Error loading data",
          description: "Failed to parse CSV file. Please check the file format.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "Could not read the uploaded file.",
        variant: "destructive",
      });
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  useEffect(() => {
    if (rawData.length > 0) {
      const filtered = applyFilters(rawData, filters);
      setFilteredData(filtered);
    }
  }, [filters, rawData]);

  const hasActiveFilters = Object.values(filters).some((f) => f.length > 0);

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Obesity Data Analysis Dashboard
              </h1>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isLoading ? "Loading..." : rawData.length > 0 ? "Replace Data" : "Upload CSV"}
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Exploring the relationship between demographics, lifestyle habits, and obesity levels
          </p>
        </div>

        {rawData.length === 0 && (
          <Alert className="mb-6">
            <Upload className="h-4 w-4" />
            <AlertDescription>
              Please upload the ObesityDataSet CSV file to begin analysis.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Bar */}
        {rawData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <ChartCard title="Total Records" className="bg-card">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-primary">{filteredData.length}</p>
                <TrendingUp className="h-8 w-8 text-primary opacity-50" />
              </div>
            </ChartCard>
            <ChartCard title="Gender Distribution" className="bg-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Male: {filteredData.filter((d) => d.Gender === "Male").length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Female: {filteredData.filter((d) => d.Gender === "Female").length}
                </p>
              </div>
            </ChartCard>
            <ChartCard title="Filters Active" className="bg-card">
              <p className="text-3xl font-bold text-primary">
                {hasActiveFilters ? "Yes" : "No"}
              </p>
            </ChartCard>
          </div>
        )}

        {hasActiveFilters && rawData.length > 0 && (
          <Alert className="mb-6">
            <AlertDescription>
              Filters are active. Showing {filteredData.length} of {rawData.length} records.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Layout */}
        {rawData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Charts Grid */}
          <div className="lg:col-span-3 space-y-6">
            {/* Demographics Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded"></span>
                Demographics Overview
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Obesity Level by Gender"
                  description="Distribution of obesity levels across gender"
                >
                  <ObesityByGender data={filteredData} />
                </ChartCard>
                <ChartCard
                  title="Family History Distribution"
                  description="Prevalence of family history with overweight"
                >
                  <FamilyHistoryChart data={filteredData} />
                </ChartCard>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ChartCard
                title="Obesity Level by Age Band"
                description="How obesity levels vary across different age groups"
              >
                <ObesityByAge data={filteredData} />
              </ChartCard>
            </div>

            {/* Dietary Habits Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded"></span>
                Dietary Habits
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <ChartCard
                  title="High-Calorie Food Consumption vs Obesity Level"
                  description="Impact of frequent high-calorie food intake"
                >
                  <FAVCvsObesity data={filteredData} />
                </ChartCard>
              </div>
            </div>

            {/* Behavioral Patterns Section */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-chart-4 rounded"></span>
                Behavioral Patterns
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Physical Activity vs Weight"
                  description="Relationship between exercise frequency and body weight"
                >
                  <FAFvsObesity data={filteredData} />
                </ChartCard>
                <ChartCard
                  title="Transportation Mode & Obesity"
                  description="How transportation choices relate to obesity levels"
                >
                  <TransportationChart data={filteredData} />
                </ChartCard>
              </div>
            </div>

            {/* Key Insights */}
            <ChartCard 
              title="Key Risk Signal Associations" 
              description="Notable patterns indicating higher obesity risk"
              className="bg-accent/5"
            >
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
                  <span className="text-chart-6 font-bold text-lg">⚠️</span>
                  <div>
                    <p className="font-semibold">Low Physical Activity + High-Calorie Diet</p>
                    <p className="text-muted-foreground">
                      Individuals with infrequent exercise and regular high-calorie food consumption show significantly higher obesity prevalence.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
                  <span className="text-chart-5 font-bold text-lg">📊</span>
                  <div>
                    <p className="font-semibold">Family History Impact</p>
                    <p className="text-muted-foreground">
                      Strong correlation between family history of overweight and current obesity levels across all age groups.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg">
                  <span className="text-chart-4 font-bold text-lg">🚗</span>
                  <div>
                    <p className="font-semibold">Sedentary Transportation</p>
                    <p className="text-muted-foreground">
                      Car-dependent transportation combined with high screen time correlates with increased obesity risk.
                    </p>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Index;
