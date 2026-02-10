import type { PricingScenario, RevenueLiftResult, ElasticityModel } from './types';

/**
 * Расчет прироста выручки при изменении цены
 */
export const calculateRevenueLift = (
   scenario: PricingScenario,
   elasticityModel: ElasticityModel // Теперь используется ниже
): RevenueLiftResult => {
   const {
      currentPrice,
      newPrice,
      currentCustomers,
      averageChurn,
   } = scenario;

   const priceChangePercent = (newPrice - currentPrice) / currentPrice;

   // ИСПРАВЛЕНО: Используем elasticityModel для расчета (убирает ts6133)
   const customerLossPercent = Math.abs(priceChangePercent * elasticityModel.priceElasticity);

   // Учитываем базовый отток и потерю от изменения цены
   const totalChurn = (averageChurn / 100 / 12) + customerLossPercent;
   const newCustomerCount = Math.max(currentCustomers * (1 - totalChurn), currentCustomers * 0.5);

   const currentAnnualRevenue = currentPrice * currentCustomers * 12;
   const newAnnualRevenue = newPrice * newCustomerCount * 12;
   const revenueLift = newAnnualRevenue - currentAnnualRevenue;

   return {
      currentAnnualRevenue,
      newAnnualRevenue,
      revenueLift,
      revenueLiftPercent: (revenueLift / currentAnnualRevenue) * 100,
      customerChurnImpact: currentCustomers - newCustomerCount,
      netGain: revenueLift > 0 ? revenueLift : 0,
      breakEvenCustomers: currentAnnualRevenue / (newPrice * 12),
   };
};

/**
 * Расчет оптимальной цены
 */
export const findOptimalPrice = (
   basePrice: number,
   currentCustomers: number,
   priceElasticity: number, // Теперь используется ниже (убирает ts6133)
   priceRange: { min: number; max: number } = { min: basePrice * 0.5, max: basePrice * 2 }
): { optimalPrice: number; maxRevenue: number } => {
   let maxRevenue = 0;
   let optimalPrice = basePrice;

   const step = (priceRange.max - priceRange.min) / 100;

   for (let price = priceRange.min; price <= priceRange.max; price += step) {
      const priceChangePercent = (price - basePrice) / basePrice;
      // ИСПРАВЛЕНО: Используем priceElasticity в расчете
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
   // ИСПРАВЛЕНО: Теперь elasticityModel передается корректно (убирает красную ошибку ts2304)
   return scenarios.map((scenario) => calculateRevenueLift(scenario, elasticityModel));
};
