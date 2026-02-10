// src/core/types.ts

/**
 * ========== PRICING PLAYBOOKS ==========
 */
export interface PricingTier {
   name: string;
   features: string[];
   priceRange: string;
   targetCustomer: string;
}

export interface PlaybookTip {
   category: string;
   advice: string;
   source: 'McKinsey' | 'Bain' | 'BCG';
}

export interface PricingPlaybook {
   id: string;
   category: 'SaaS' | 'Agency' | 'Infrastructure';
   title: string;
   description: string;
   recommendedTiers: PricingTier[];
   strategicTips: PlaybookTip[];
   pricingModel: 'subscription' | 'usage-based' | 'value-based' | 'hybrid';
}

/**
 * ========== ELASTICITY MODELS ==========
 */
export interface ElasticityModel {
   industry: string;
   priceElasticity: number;
   demandCurve: (price: number) => number;
}

/**
 * ========== PRICING SCENARIOS & RESULTS ==========
 */
export interface PricingScenario {
   currentPrice: number;
   newPrice: number;
   currentCustomers: number;
   customerAcquisitionCost: number;
   averageContractLength: number;
   priceElasticity?: number;
   averageChurn: number;
}

export interface RevenueLiftResult {
   currentAnnualRevenue: number;
   newAnnualRevenue: number;
   revenueLift: number;
   revenueLiftPercent: number;
   customerChurnImpact: number;
   netGain: number;
   breakEvenCustomers: number;
   netProfitImpact?: number;
}

/**
 * ========== PRICING DATA & REPORTS ==========
 */
export interface PricingData {
   currentPrice: number;
   currentCustomers?: number;
   customerAcquisitionCost?: number;
   averageContractLength?: number;
   currency?: string;
   lastUpdateDate: Date;
}

export interface ReportData {
   brandName: string;
   currentPricing: {
      price: number;
      currency: string;
      lastUpdate: Date;
   };
   recommendedPricing: {
      price: number;
      adjustmentReason: string;
      inflationImpact: number;
   };
   selectedPlaybook?: PricingPlaybook;
   comparisonChart: {
      competitors: Array<{
         name: string;
         price: number;
         features: string[];
      }>;
   };
   generatedDate: Date;
}

/**
 * ========== LTV MODELS ==========
 */
export type PricingModel = 'flat_fee' | 'per_seat' | 'usage_based';

export interface LTVProjection {
   model: PricingModel;
   monthlyRevenue: number;
   customerLifetime: number;
   totalLTV: number;
   marginAfterCAC: number;
   paybackPeriod: number;
}

/**
 * ========== INFLATION ADJUSTMENT ==========
 */
export interface InflationAdjustment {
   suggestedPrice: number;
   adjustmentPercentage: number;
   reasoning: string;
}
