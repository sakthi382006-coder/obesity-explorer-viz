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
import { Activity, Users, Heart, TrendingUp, Upload, Apple, Footprints, Scale } from "lucide-react";
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

  // Auto-load dataset on mount
  useEffect(() => {
    const loadDefaultDataset = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/ObesityDataSet_raw_and_data_sinthetic.csv');
        const csvText = await response.text();
        const parsed = parseCSV(csvText);
        setRawData(parsed);
        setFilteredData(parsed);
        toast({
          title: "Dataset loaded",
          description: `Loaded ${parsed.length} records`,
        });
      } catch (error) {
        console.error("Error loading dataset:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDefaultDataset();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-header)]" />
        <div className="container relative mx-auto py-12 px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="p-3 rounded-2xl bg-primary/10 backdrop-blur-sm">
                <Scale className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-foreground tracking-tight">
                  Obesity Explorer
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Lifestyle & Demographic Insights
                </p>
              </div>
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
                className="gap-2 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                <Upload className="h-5 w-5" />
                {isLoading ? "Loading..." : rawData.length > 0 ? "Replace Data" : "Upload CSV"}
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Discover how habits and demographics influence obesity levels through interactive data visualization
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="container mx-auto px-4 -mt-6 mb-8">
        {rawData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
            <ChartCard title="Total Records" className="border-l-4 border-l-primary">
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-primary">{filteredData.length}</p>
                <Activity className="h-10 w-10 text-primary/30" />
              </div>
              {hasActiveFilters && (
                <p className="text-xs text-muted-foreground mt-2">of {rawData.length} total</p>
              )}
            </ChartCard>
            <ChartCard title="Male" className="border-l-4 border-l-chart-1">
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-chart-1">
                  {filteredData.filter((d) => d.Gender === "Male").length}
                </p>
                <Users className="h-10 w-10 text-chart-1/30" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {((filteredData.filter((d) => d.Gender === "Male").length / filteredData.length) * 100).toFixed(1)}% of total
              </p>
            </ChartCard>
            <ChartCard title="Female" className="border-l-4 border-l-chart-2">
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-chart-2">
                  {filteredData.filter((d) => d.Gender === "Female").length}
                </p>
                <Users className="h-10 w-10 text-chart-2/30" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {((filteredData.filter((d) => d.Gender === "Female").length / filteredData.length) * 100).toFixed(1)}% of total
              </p>
            </ChartCard>
            <ChartCard title="Family History" className="border-l-4 border-l-accent">
              <div className="flex items-center justify-between">
                <p className="text-4xl font-bold text-accent">
                  {filteredData.filter((d) => d.family_history_with_overweight === "yes").length}
                </p>
                <Heart className="h-10 w-10 text-accent/30" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">with overweight history</p>
            </ChartCard>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="container mx-auto px-4 pb-12">
        {rawData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterPanel filters={filters} onFilterChange={setFilters} />
            </div>

            {/* Charts Grid */}
            <div className="lg:col-span-3 space-y-10">
              {/* Demographics Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Demographics Overview
                  </h2>
                </div>
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
                <ChartCard
                  title="Obesity Level by Age Band"
                  description="How obesity levels vary across different age groups"
                >
                  <ObesityByAge data={filteredData} />
                </ChartCard>
              </section>

              {/* Dietary Habits Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Apple className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Dietary Habits
                  </h2>
                </div>
                <ChartCard
                  title="High-Calorie Food Consumption vs Obesity Level"
                  description="Impact of frequent high-calorie food intake"
                >
                  <FAVCvsObesity data={filteredData} />
                </ChartCard>
              </section>

              {/* Behavioral Patterns Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Footprints className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Behavioral Patterns
                  </h2>
                </div>
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
              </section>

              {/* Key Insights */}
              <ChartCard 
                title="🎯 Key Risk Signal Associations" 
                description="Notable patterns indicating higher obesity risk"
                className="border-l-4 border-l-destructive"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-chart-6/10 to-transparent border border-chart-6/20 hover:border-chart-6/40 transition-all">
                    <div className="p-2 rounded-lg bg-chart-6/20 shrink-0">
                      <Activity className="h-5 w-5 text-chart-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Low Physical Activity + High-Calorie Diet</p>
                      <p className="text-sm text-muted-foreground">
                        Individuals with infrequent exercise and regular high-calorie food consumption show significantly higher obesity prevalence.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-chart-5/10 to-transparent border border-chart-5/20 hover:border-chart-5/40 transition-all">
                    <div className="p-2 rounded-lg bg-chart-5/20 shrink-0">
                      <Heart className="h-5 w-5 text-chart-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Family History Impact</p>
                      <p className="text-sm text-muted-foreground">
                        Strong correlation between family history of overweight and current obesity levels across all age groups.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-chart-4/10 to-transparent border border-chart-4/20 hover:border-chart-4/40 transition-all">
                    <div className="p-2 rounded-lg bg-chart-4/20 shrink-0">
                      <TrendingUp className="h-5 w-5 text-chart-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">Sedentary Transportation</p>
                      <p className="text-sm text-muted-foreground">
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
