// src/core/types.ts

// --- Базовые типы стратегий ---
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

// Типы моделей прайсинга (унифицированные названия)
export type PricingModel = 'subscription' | 'usage-based' | 'value-based' | 'hybrid' | 'flat_fee' | 'per_seat';

export interface PricingPlaybook {
   id: string;
   category: 'SaaS' | 'Agency' | 'Infrastructure';
   title: string;
   description: string;
   recommendedTiers: PricingTier[];
   strategicTips: PlaybookTip[];
   pricingModel: PricingModel;
}

// --- Типы для LTV (ИСПРАВЛЯЕТ ОШИБКУ ts2305 НА СКРИНШОТЕ) ---
export interface LTVProjection {
   model: PricingModel;
   monthlyRevenue: number;
   customerLifetime: number;
   totalLTV: number;
   marginAfterCAC: number;
   paybackPeriod: number;
}

// --- Типы для расчетов и симулятора ---
export interface PricingScenario {
   currentPrice: number;
   newPrice: number;
   currentCustomers: number;
   customerAcquisitionCost: number;
   averageContractLength: number;
   priceElasticity: number;
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
   netProfitImpact: number;
}

export interface CalculationResults {
   currentAnnualRevenue: number;
   newAnnualRevenue: number;
   revenueLift: number;
   revenueLiftPercent: number;
   suggestedPrice?: number;
   adjustmentPercentage?: number;
}

export interface ElasticityModel {
   industry: string;
   priceElasticity: number;
   demandCurve: (price: number) => number;
}

// --- Типы для CSV аналитики ---
export interface AnomalyData {
   rowIndex: number;
   customerId: string;
   customerName: string;
   currentPrice: number;
   expectedPrice: number;
   medianPrice: number;
   priceDeviation: number;
   deviationPercent: number;
   severity: 'low' | 'medium' | 'high';
   potentialRecovery: number;
}

export interface CSVAnalysisResult {
   totalCustomers: number;
   totalMRR: number;
   totalARR: number;
   medianPrice: number;
   averagePrice: number;
   anomalies: AnomalyData[];
   anomalyCount: number;
   potentialRecoveryTotal: number;
}

export interface CSVRow {
   customerId: string;
   customerName: string;
   currentPrice: number;
   monthlyChurn: number;
   contractStartDate: string;
   [key: string]: any;
}

// --- Общие данные ---
export interface PricingData {
   currentPrice: number;
   customers: number;
   currency: string;
   lastUpdateDate: Date;
}

export interface ReportData {
   brandName: string;
   currentPricing: { price: number; currency: string; lastUpdate: Date };
   recommendedPricing: { price: number; adjustmentReason: string; inflationImpact: number };
   selectedPlaybook?: PricingPlaybook;
   comparisonChart: { competitors: Array<{ name: string; price: number; features: string[] }> };
   generatedDate: Date;
}
