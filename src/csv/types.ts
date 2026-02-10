// src/csv/types.ts

/**
 * Описание одной строки в исходном CSV файле
 */
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

/**
 * Описание одной найденной аномалии (отклонения в цене)
 * ИСПРАВЛЕНО: Имя изменено на AnomalyData для совместимости с AnomalyTable.tsx
 */
export interface AnomalyData {
   rowIndex: number;
   customerId: string;
   customerName: string;
   currentPrice: number;
   medianPrice: number;
   expectedPrice: number; // Это поле обязательно, чтобы не было ошибки ts(2322)
   priceDeviation: number;
   deviationPercent: number;
   severity: 'low' | 'medium' | 'high';
   potentialRecovery: number;
}

/**
 * Общие результаты анализа CSV-файла
 */
export interface CSVAnalysisResult {
   totalCustomers: number;
   totalMRR: number;
   totalARR: number;
   medianPrice: number;
   averagePrice: number;
   anomalies: AnomalyData[]; // Используем AnomalyData вместо AnomalyRecord
   anomalyCount: number;
   potentialRecoveryTotal: number;
}

/**
 * Результат парсинга файла (с ошибками, если есть)
 */
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
