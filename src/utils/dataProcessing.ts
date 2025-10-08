import { ObesityData, FilterState } from "@/types/obesity";

export const parseCSV = (csvText: string): ObesityData[] => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");
  
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const record: any = {};
    
    headers.forEach((header, index) => {
      const cleanHeader = header.trim();
      const value = values[index]?.trim();
      
      if (cleanHeader === "Age" || cleanHeader === "Height" || 
          cleanHeader === "Weight" || cleanHeader === "FCVC" || 
          cleanHeader === "NCP" || cleanHeader === "CH2O" || 
          cleanHeader === "FAF" || cleanHeader === "TUE") {
        record[cleanHeader] = parseFloat(value) || 0;
      } else {
        record[cleanHeader] = value || "";
      }
    });
    
    return record as ObesityData;
  });
};

export const getAgeBand = (age: number): string => {
  if (age < 20) return "Under 20";
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  return "60+";
};

export const getFAFLevel = (faf: number): string => {
  if (faf === 0) return "No Activity";
  if (faf <= 1) return "Low (0-1)";
  if (faf <= 2) return "Moderate (1-2)";
  return "High (2+)";
};

export const applyFilters = (
  data: ObesityData[],
  filters: FilterState
): ObesityData[] => {
  return data.filter((row) => {
    const ageBand = getAgeBand(row.Age);
    const fafLevel = getFAFLevel(row.FAF);
    
    if (filters.gender.length > 0 && !filters.gender.includes(row.Gender)) {
      return false;
    }
    if (filters.ageBand.length > 0 && !filters.ageBand.includes(ageBand)) {
      return false;
    }
    if (
      filters.familyHistory.length > 0 &&
      !filters.familyHistory.includes(row.family_history_with_overweight)
    ) {
      return false;
    }
    if (filters.favc.length > 0 && !filters.favc.includes(row.FAVC)) {
      return false;
    }
    if (filters.faf.length > 0 && !filters.faf.includes(fafLevel)) {
      return false;
    }
    if (filters.calc.length > 0 && !filters.calc.includes(row.CALC)) {
      return false;
    }
    
    return true;
  });
};

export const groupByField = <T extends Record<string, any>>(
  data: T[],
  field: keyof T
): Record<string, T[]> => {
  return data.reduce((acc, item) => {
    const key = String(item[field]);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};
