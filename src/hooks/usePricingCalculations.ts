import { useState, useCallback } from 'react';
import { calculateRevenueLift, findOptimalPrice } from '../core/pricing';
import { selectElasticityModel } from '../core/elasticity';
import type { PricingScenario, RevenueLiftResult } from '../core/types';

export const usePricingCalculations = () => {
   const [results, setResults] = useState<RevenueLiftResult | null>(null);
   const [isCalculating, setIsCalculating] = useState(false);

   const calculateRevenueLiftScenario = useCallback(
      (scenario: PricingScenario, industry: 'saas' | 'agency' | 'infrastructure') => {
         setIsCalculating(true);
         try {
            const elasticityModel = selectElasticityModel(industry, 'medium');
            const result = calculateRevenueLift(scenario, elasticityModel);
            setResults(result);
            return result;
         } finally {
            setIsCalculating(false);
         }
      },
      []
   );

   const findOptimal = useCallback(
      (
         basePrice: number,
         customers: number,
         elasticity: number,
         range?: { min: number; max: number }
      ) => {
         setIsCalculating(true);
         try {
            const result = findOptimalPrice(basePrice, customers, elasticity, range);
            return result;
         } finally {
            setIsCalculating(false);
         }
      },
      []
   );

   return {
      results,
      isCalculating,
      calculateRevenueLiftScenario,
      findOptimal,
   };
};
