// src/csv/anomaly.ts
import type { CSVRow, CSVAnalysisResult, AnomalyData } from './types';

export const analyzeCSVData = (rows: CSVRow[]): CSVAnalysisResult => {
   const prices = rows.map(r => r.currentPrice).sort((a, b) => a - b);

   const mid = Math.floor(prices.length / 2);
   const medianPrice = prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;

   const anomalies: AnomalyData[] = rows
      .filter(r => r.currentPrice < medianPrice)
      .map((r, index) => ({
         rowIndex: index,
         customerId: r.customerId,
         customerName: r.customerName,
         currentPrice: r.currentPrice,
         medianPrice: medianPrice,
         expectedPrice: medianPrice, // Назначаем медиану как ожидаемую цену
         priceDeviation: medianPrice - r.currentPrice,
         deviationPercent: ((medianPrice - r.currentPrice) / medianPrice) * 100,
         severity: (medianPrice - r.currentPrice) / medianPrice > 0.3 ? 'high' : 'medium',
         potentialRecovery: medianPrice - r.currentPrice
      }));

   const totalMRR = rows.reduce((sum, r) => sum + r.currentPrice, 0);

   return {
      totalCustomers: rows.length,
      totalMRR,
      totalARR: totalMRR * 12,
      medianPrice,
      averagePrice: totalMRR / rows.length,
      anomalies,
      anomalyCount: anomalies.length,
      potentialRecoveryTotal: anomalies.reduce((sum, a) => sum + a.potentialRecovery, 0)
   };
};
