import type { LTVProjection, PricingModel } from './types';

/**
 * Расчет Customer Lifetime Value (LTV)
 * 
 * Формула:
 * LTV = ARPU * Gross Margin * Customer Lifetime (в месяцах)
 * где Customer Lifetime = 1 / Monthly Churn Rate
 */
export const calculateLTV = (
   monthlyRevenue: number,
   monthlyChurnRate: number, // 0.05 = 5% в месяц
   grossMarginPercent: number = 80
): LTVProjection => {
   // Расчет среднего времени жизни клиента в месяцах
   const customerLifetime = 1 / monthlyChurnRate;

   // Валовая прибыль
   const grossMargin = (monthlyRevenue * grossMarginPercent) / 100;

   // LTV = Среднемесячная прибыль * Время жизни клиента
   const totalLTV = grossMargin * customerLifetime;

   return {
      model: 'flat_fee',
      monthlyRevenue,
      customerLifetime,
      totalLTV,
      marginAfterCAC: 0,
      paybackPeriod: 0,
   };
};

/**
 * Сравнение LTV для разных моделей прайсинга
 */
export const compareLTVModels = (
   flatFeePrice: number,
   perSeatPrice: number,
   averageSeatsPerCustomer: number,
   usageBasedPrice: number,
   averageUsagePerCustomer: number,
   monthlyChurnRate: number,
   customerAcquisitionCost: number,
   grossMarginPercent: number = 80
): {
   flatFee: LTVProjection & { paybackMonths: number };
   perSeat: LTVProjection & { paybackMonths: number };
   usageBased: LTVProjection & { paybackMonths: number };
} => {
   // Flat Fee модель
   const flatFeeRevenue = flatFeePrice;
   const flatFeeLTV = calculateLTV(flatFeeRevenue, monthlyChurnRate, grossMarginPercent);
   const flatFeePayback = customerAcquisitionCost / (flatFeeRevenue * (grossMarginPercent / 100));

   // Per Seat модель
   const perSeatRevenue = perSeatPrice * averageSeatsPerCustomer;
   const perSeatLTV = calculateLTV(perSeatRevenue, monthlyChurnRate, grossMarginPercent);
   const perSeatPayback = customerAcquisitionCost / (perSeatRevenue * (grossMarginPercent / 100));

   // Usage-Based модель
   const usageRevenue = usageBasedPrice * averageUsagePerCustomer;
   const usageLTV = calculateLTV(usageRevenue, monthlyChurnRate, grossMarginPercent);
   const usagePayback = customerAcquisitionCost / (usageRevenue * (grossMarginPercent / 100));

   return {
      flatFee: {
         ...flatFeeLTV,
         model: 'flat_fee',
         paybackPeriod: flatFeePayback,
         marginAfterCAC: flatFeeLTV.totalLTV - customerAcquisitionCost,
         paybackMonths: flatFeePayback,
      },
      perSeat: {
         ...perSeatLTV,
         model: 'per_seat',
         paybackPeriod: perSeatPayback,
         marginAfterCAC: perSeatLTV.totalLTV - customerAcquisitionCost,
         paybackMonths: perSeatPayback,
      },
      usageBased: {
         ...usageLTV,
         model: 'usage_based',
         paybackPeriod: usagePayback,
         marginAfterCAC: usageLTV.totalLTV - customerAcquisitionCost,
         paybackMonths: usagePayback,
      },
   };
};

/**
 * Расчет влияния изменения цены на LTV
 */
export const calculateLTVImpact = (
   currentPrice: number,
   newPrice: number,
   monthlyChurnRate: number,
   customerAcquisitionCost: number,
   priceElasticity: number = -1.0
): {
   currentLTV: number;
   newLTV: number;
   ltvIncrease: number;
   paybackPeriodChange: number;
} => {
   const currentLTV = calculateLTV(currentPrice, monthlyChurnRate).totalLTV;

   // При повышении цены может измениться churn
   const priceChangePercent = (newPrice - currentPrice) / currentPrice;
   const churnIncrease = Math.abs(priceChangePercent * priceElasticity * 0.01);
   const newChurnRate = Math.min(monthlyChurnRate + churnIncrease, 0.15); // макс 15% churn

   const newLTV = calculateLTV(newPrice, newChurnRate).totalLTV;

   const currentPayback = customerAcquisitionCost / (currentPrice * 0.8);
   const newPayback = customerAcquisitionCost / (newPrice * 0.8);

   return {
      currentLTV,
      newLTV,
      ltvIncrease: newLTV - currentLTV,
      paybackPeriodChange: newPayback - currentPayback,
   };
};

/**
 * Оптимизация LTV через изменение модели прайсинга
 */
export const optimizeLTVByModel = (
   currentMonthlyRevenue: number,
   monthlyChurnRate: number,
   customerAcquisitionCost: number,
   models: PricingModel[]
): {
   model: PricingModel;
   ltv: number;
   paybackMonths: number;
   recommendation: string;
}[] => {
   return models
      .map((model) => {
         const ltv = calculateLTV(currentMonthlyRevenue, monthlyChurnRate).totalLTV;
         const payback = customerAcquisitionCost / (currentMonthlyRevenue * 0.8);

         return {
            model,
            ltv,
            paybackMonths: payback,
            recommendation: payback < 12 ? 'Отличный выбор' : 'Требует оптимизации',
         };
      })
      .sort((a, b) => b.ltv - a.ltv);
};
