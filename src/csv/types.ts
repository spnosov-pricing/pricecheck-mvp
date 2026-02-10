// src/csv/types.ts

export interface CSVRow {
   customerId: string;
   customerName: string;
   currentPrice: number;
   monthlyChurn: number;
   contractStartDate: string;
   seats?: number;
   usage?: number;
   [key: string]: string | number | undefined;
}

export interface ParsedCSVData {
   rows: CSVRow[];
   totalRows: number;
   validRows: number;
   errors: CSVParseError[];
}

export interface CSVParseError {
   rowIndex: number;
   field: string;
   value: any;
   error: string;
}

export interface AnomalyRecord {
   rowIndex: number;
   customerId: string;
   customerName: string;
   currentPrice: number;
   medianPrice: number;
   priceDeviation: number;
   deviationPercent: number;
   severity: 'low' | 'medium' | 'high';
   potentialRecovery: number;
}

export interface CSVAnalysisResult {
   totalCustomers: number;
   totalMRR: number;
   totalARR: number;
   medianPrice: number;
   averagePrice: number;
   anomalies: AnomalyRecord[];
   anomalyCount: number;
   potentialRecoveryTotal: number;
}
