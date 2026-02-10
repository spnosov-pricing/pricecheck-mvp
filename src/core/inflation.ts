import { differenceInMonths } from 'date-fns';
// ИСПРАВЛЕНО: Добавлен префикс type для соответствия правилам TS
import type { InflationImpact } from './types';

/**
 * IT-сектор инфляция по годам (бенчмарки)
 * Источник: McKinsey, Gartner reports
 */
const IT_INFLATION_BENCHMARKS: Record<number, number> = {
   2020: 0.02, // 2%
   2021: 0.03, // 3%
   2022: 0.08, // 8%
   2023: 0.05, // 5%
   2024: 0.04, // 4%
};

const DEFAULT_IT_INFLATION_RATE = 0.04; // 4% по умолчанию

/**
 * Расчет кумулятивной инфляции за период
 */
const calculateCumulativeInflation = (
   startDate: Date,
   endDate: Date = new Date()
): number => {
   let cumulativeInflation = 1;
   let currentDate = new Date(startDate);

   while (currentDate < endDate) {
      const year = currentDate.getFullYear();
      const rate = IT_INFLATION_BENCHMARKS[year] || DEFAULT_IT_INFLATION_RATE;

      // Добавляем инфляцию за месяц
      cumulativeInflation *= 1 + rate / 12;

      currentDate.setMonth(currentDate.getMonth() + 1);
   }

   return cumulativeInflation - 1;
};

/**
 * Расчет обесценивания текущего MRR из-за инфляции
 */
export const calculateInflationImpact = (
   currentPrice: number,
   currentCustomers: number,
   lastPriceIncreaseDate: Date
   // ИСПРАВЛЕНО: Удален неиспользуемый параметр industry для чистоты кода
): InflationImpact => {
   const now = new Date();
   const monthsSincePriceIncrease = differenceInMonths(now, lastPriceIncreaseDate);

   // Расчет кумулятивной инфляции
   const cumulativeInflationImpact = calculateCumulativeInflation(
      lastPriceIncreaseDate,
      now
   );

   // Рекомендуемая новая цена
   const recommendedNewPrice = currentPrice * (1 + cumulativeInflationImpact);

   // Потенциальное восстановление выручки в год
   const priceIncrease = recommendedNewPrice - currentPrice;
   const potentialRecovery = priceIncrease * currentCustomers * 12;

   // Средняя инфляция в IT-секторе за период
   const itInflationRate = cumulativeInflationImpact / (monthsSincePriceIncrease / 12);

   return {
      lastPriceIncreaseDate,
      monthsSincePriceIncrease,
      itInflationRate,
      cumulativeInflationImpact,
      recommendedNewPrice,
      potentialRecovery,
   };
};

/**
 * Расчет "потерянных денег" из-за инфляции
 */
export const calculateInflationLeakage = (
   currentPrice: number,
   currentCustomers: number,
   monthsSincePriceIncrease: number,
   annualInflationRate: number = DEFAULT_IT_INFLATION_RATE
): {
   leakageMonthly: number;
   leakageAnnual: number;
   leakagePercent: number;
   recommendedPrice: number;
} => {
   const monthlyRate = annualInflationRate / 12;
   const cumulativeInflation = Math.pow(1 + monthlyRate, monthsSincePriceIncrease) - 1;

   const recommendedPrice = currentPrice * (1 + cumulativeInflation);
   const priceGap = recommendedPrice - currentPrice;

   const leakageMonthly = priceGap * currentCustomers;
   const leakageAnnual = leakageMonthly * 12;
   const leakagePercent = (cumulativeInflation / 1) * 100;

   return {
      leakageMonthly,
      leakageAnnual,
      leakagePercent,
      recommendedPrice,
   };
};

/**
 * Сценарий инфляции: какая будет цена через N месяцев
 */
export const projectInflationScenario = (
   currentPrice: number,
   monthsAhead: number,
   annualInflationRate: number = DEFAULT_IT_INFLATION_RATE
): {
   projectedPrice: number;
   totalInflationImpact: number;
   monthlyIncrease: number;
} => {
   const monthlyRate = annualInflationRate / 12;
   const projectedPrice = currentPrice * Math.pow(1 + monthlyRate, monthsAhead);
   const totalInflationImpact = projectedPrice - currentPrice;
   const monthlyIncrease = totalInflationImpact / monthsAhead;

   return {
      projectedPrice,
      totalInflationImpact,
      monthlyIncrease,
   };
};
