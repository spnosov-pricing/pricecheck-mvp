// src/core/pricing.ts
import type { PricingScenario, RevenueLiftResult, ElasticityModel } from './types';

/**
 * Расчет прироста выручки и прибыли при изменении цены с учетом CAC
 */
export const calculateRevenueLift = (
   scenario: PricingScenario,
   elasticityModel: ElasticityModel
): RevenueLiftResult => {
   const {
      currentPrice,
      newPrice,
      currentCustomers,
      averageChurn,
      customerAcquisitionCost,
   } = scenario;

   const priceChangePercent = (newPrice - currentPrice) / currentPrice;

   // Расчет эластичности спроса
   const customerLossPercent = Math.abs(
      priceChangePercent * elasticityModel.priceElasticity
   );

   // Учитываем базовый месячный отток и потерю от изменения цены
   const totalChurn = averageChurn / 100 / 12 + customerLossPercent;
   const newCustomerCount = Math.max(
      currentCustomers * (1 - totalChurn),
      currentCustomers * 0.5
   );

   // Валовая выручка (Annual Revenue)
   const currentAnnualRevenue = currentPrice * currentCustomers * 12;
   const newAnnualRevenue = newPrice * newCustomerCount * 12;

   // Учет затрат на привлечение (CAC)
   const currentTotalCAC = currentCustomers * customerAcquisitionCost;
   const newTotalCAC = newCustomerCount * customerAcquisitionCost;

   const revenueLift = newAnnualRevenue - currentAnnualRevenue;

   return {
      currentAnnualRevenue,
      newAnnualRevenue,
      revenueLift,
      revenueLiftPercent:
         currentAnnualRevenue > 0
            ? (revenueLift / currentAnnualRevenue) * 100
            : 0,
      customerChurnImpact: currentCustomers - newCustomerCount,
      netGain: revenueLift > 0 ? revenueLift : 0,
      breakEvenCustomers: currentAnnualRevenue / (newPrice * 12),
      netProfitImpact:
         newAnnualRevenue - newTotalCAC - (currentAnnualRevenue - currentTotalCAC),
   };
};

/**
 * Расчет оптимальной цены
 */
export const findOptimalPrice = (
   basePrice: number,
   currentCustomers: number,
   priceElasticity: number,
   priceRange: { min: number; max: number } = {
      min: basePrice * 0.5,
      max: basePrice * 2,
   }
): { optimalPrice: number; maxRevenue: number } => {
   let maxRevenue = 0;
   let optimalPrice = basePrice;

   const step = (priceRange.max - priceRange.min) / 100;

   for (let price = priceRange.min; price <= priceRange.max; price += step) {
      const priceChangePercent = (price - basePrice) / basePrice;
      const demandDrop = Math.abs(priceChangePercent * priceElasticity);
      const revenue = price * (currentCustomers * (1 - demandDrop)) * 12;

      if (revenue > maxRevenue) {
         maxRevenue = revenue;
         optimalPrice = price;
      }
   }

   return { optimalPrice, maxRevenue };
};

/**
 * Сравнение нескольких сценариев
 */
export const compareScenarios = (
   scenarios: PricingScenario[],
   elasticityModel: ElasticityModel
): RevenueLiftResult[] => {
   return scenarios.map((scenario) =>
      calculateRevenueLift(scenario, elasticityModel)
   );
};
