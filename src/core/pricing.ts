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
      customerAcquisitionCost
   } = scenario;

   const priceChangePercent = (newPrice - currentPrice) / currentPrice;

   // Расчет эластичности (потеря спроса)
   const customerLossPercent = Math.abs(priceChangePercent * elasticityModel.priceElasticity);

   // Учитываем базовый отток и потерю от изменения цены
   const totalChurn = (averageChurn / 100 / 12) + customerLossPercent;
   const newCustomerCount = Math.max(currentCustomers * (1 - totalChurn), currentCustomers * 0.5);

   const currentAnnualRevenue = currentPrice * currentCustomers * 12;
   const newAnnualRevenue = newPrice * newCustomerCount * 12;

   const revenueLift = newAnnualRevenue - currentAnnualRevenue;

   // Экономия на CAC при уменьшении базы (если есть отток)
   const savedCAC = (currentCustomers - newCustomerCount) * customerAcquisitionCost;

   return {
      currentAnnualRevenue,
      newAnnualRevenue,
      revenueLift,
      revenueLiftPercent: currentAnnualRevenue > 0 ? (revenueLift / currentAnnualRevenue) * 100 : 0,
      customerChurnImpact: currentCustomers - newCustomerCount,
      netGain: revenueLift > 0 ? revenueLift : 0,
      breakEvenCustomers: currentAnnualRevenue / (newPrice * 12),
      netProfitImpact: revenueLift + savedCAC
   };
};

/**
 * Расчет оптимальной цены (то, чего не хватало)
 */
export const findOptimalPrice = (
   basePrice: number,
   currentCustomers: number,
   priceElasticity: number,
   priceRange: { min: number; max: number } = { min: basePrice * 0.5, max: basePrice * 2 }
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
   return scenarios.map((scenario) => calculateRevenueLift(scenario, elasticityModel));
};
