export interface PricingInput {
   currentPrice: number;
   currentCustomers: number;
   averageChurn: number; // % в год
   customerAcquisitionCost: number;
   averageContractLength: number; // месяцы
}

export interface PricingScenario extends PricingInput {
   newPrice: number;
   priceElasticity: number; // -0.5 до -2.0
}

export interface RevenueLiftResult {
   currentAnnualRevenue: number;
   newAnnualRevenue: number;
   revenueLift: number;
   revenueLiftPercent: number;
   customerChurnImpact: number;
   netGain: number;
   breakEvenCustomers: number;
}

export interface InflationImpact {
   lastPriceIncreaseDate: Date;
   monthsSincePriceIncrease: number;
   itInflationRate: number; // % в год
   cumulativeInflationImpact: number;
   recommendedNewPrice: number;
   potentialRecovery: number;
}

export interface LTVProjection {
   model: 'flat_fee' | 'per_seat' | 'usage_based';
   monthlyRevenue: number;
   customerLifetime: number; // месяцы
   totalLTV: number;
   marginAfterCAC: number;
   paybackPeriod: number; // месяцы
}

export interface PricingModel {
   name: string;
   type: 'flat_fee' | 'per_seat' | 'usage_based' | 'tiered';
   basePrice: number;
   seats?: number;
   usageUnit?: string;
   usagePrice?: number;
   features: string[];
}

export interface ElasticityModel {
   industry: 'saas' | 'agency' | 'infrastructure';
   priceElasticity: number;
   demandCurve: (price: number) => number; // функция спроса
}
