import type { CSVRow, AnomalyRecord, CSVAnalysisResult } from './types';

/**
 * Расчет статистики по ценам
 */
const calculatePriceStatistics = (prices: number[]): {
   median: number;
   mean: number;
   stdDev: number;
   q1: number;
   q3: number;
   iqr: number;
} => {
   const sorted = [...prices].sort((a, b) => a - b);
   const n = sorted.length;

   // Медиана
   const median = n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

   // Среднее
   const mean = prices.reduce((a, b) => a + b, 0) / n;

   // Стандартное отклонение
   const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / n;
   const stdDev = Math.sqrt(variance);

   // Квартили
   const q1Index = Math.floor(n / 4);
   const q3Index = Math.floor((3 * n) / 4);
   const q1 = sorted[q1Index];
   const q3 = sorted[q3Index];
   const iqr = q3 - q1;

   return { median, mean, stdDev, q1, q3, iqr };
};

/**
 * Идентификация аномалий в ценах (Legacy Pricing Leakage)
 * 
 * Критерии:
 * 1. Цена ниже медианы на 20% и более
 * 2. Цена ниже Q1 - 1.5*IQR (статистический выброс)
 * 3. Цена значительно отличается от средней (> 2 std dev)
 */
export const detectPricingAnomalies = (
   rows: CSVRow[],
   deviationThreshold: number = 0.2 // 20%
): AnomalyRecord[] => {
   if (rows.length < 3) {
      return [];
   }

   const prices = rows.map((row) => row.currentPrice);
   const stats = calculatePriceStatistics(prices);

   const anomalies: AnomalyRecord[] = [];

   rows.forEach((row, index) => {
      const price = row.currentPrice;
      const deviation = (stats.median - price) / stats.median;

      // Критерий 1: Цена ниже медианы на threshold% и более
      if (deviation >= deviationThreshold && price < stats.median) {
         anomalies.push({
            rowIndex: index,
            customerId: row.customerId,
            customerName: row.customerName || 'N/A',
            currentPrice: price,
            medianPrice: stats.median,
            priceDeviation: stats.median - price,
            deviationPercent: deviation * 100,
            severity: getSeverity(deviation),
            potentialRecovery: (stats.median - price) * 12, // Годовое восстановление
         });
      }

      // Критерий 2: Статистический выброс (IQR метод)
      const lowerBound = stats.q1 - 1.5 * stats.iqr;
      if (price < lowerBound && !anomalies.some((a) => a.rowIndex === index)) {
         const deviation2 = (stats.median - price) / stats.median;
         anomalies.push({
            rowIndex: index,
            customerId: row.customerId,
            customerName: row.customerName || 'N/A',
            currentPrice: price,
            medianPrice: stats.median,
            priceDeviation: stats.median - price,
            deviationPercent: deviation2 * 100,
            severity: 'high',
            potentialRecovery: (stats.median - price) * 12,
         });
      }
   });

   return anomalies.sort((a, b) => b.potentialRecovery - a.potentialRecovery);
};

/**
 * Определение серьезности аномалии
 */
const getSeverity = (deviationPercent: number): 'low' | 'medium' | 'high' => {
   if (deviationPercent >= 0.4) return 'high';
   if (deviationPercent >= 0.25) return 'medium';
   return 'low';
};

/**
 * Анализ CSV данных с выявлением аномалий
 */
export const analyzeCSVData = (rows: CSVRow[]): CSVAnalysisResult => {
   if (rows.length === 0) {
      return {
         totalCustomers: 0,
         totalMRR: 0,
         totalARR: 0,
         medianPrice: 0,
         averagePrice: 0,
         anomalies: [],
         anomalyCount: 0,
         potentialRecoveryTotal: 0,
      };
   }

   const prices = rows.map((row) => row.currentPrice);
   const stats = calculatePriceStatistics(prices);

   const totalMRR = prices.reduce((sum, price) => sum + price, 0);
   const totalARR = totalMRR * 12;

   const anomalies = detectPricingAnomalies(rows, 0.2);
   const potentialRecoveryTotal = anomalies.reduce(
      (sum, anomaly) => sum + anomaly.potentialRecovery,
      0
   );

   return {
      totalCustomers: rows.length,
      totalMRR,
      totalARR,
      medianPrice: stats.median,
      averagePrice: stats.mean,
      anomalies,
      anomalyCount: anomalies.length,
      potentialRecoveryTotal,
   };
};

/**
 * Группировка аномалий по серьезности
 */
export const groupAnomaliesBySeverity = (
   anomalies: AnomalyRecord[]
): Record<'low' | 'medium' | 'high', AnomalyRecord[]> => {
   return {
      low: anomalies.filter((a) => a.severity === 'low'),
      medium: anomalies.filter((a) => a.severity === 'medium'),
      high: anomalies.filter((a) => a.severity === 'high'),
   };
};

/**
 * Расчет потенциального дохода от исправления аномалий
 */
export const calculateAnomalyRecoveryPotential = (
   anomalies: AnomalyRecord[],
   recoveryRate: number = 0.8 // Предполагаем, что восстановим 80% от разницы
): {
   totalPotential: number;
   byCustomer: Array<{ customerId: string; potential: number }>;
} => {
   const totalPotential = anomalies.reduce(
      (sum, anomaly) => sum + anomaly.potentialRecovery * recoveryRate,
      0
   );

   const byCustomer = anomalies.map((anomaly) => ({
      customerId: anomaly.customerId,
      potential: anomaly.potentialRecovery * recoveryRate,
   }));

   return { totalPotential, byCustomer };
};