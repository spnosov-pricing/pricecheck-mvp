// src/core/elasticity.ts
import type { ElasticityModel } from './types';

/**
 * Модели эластичности спроса по отраслям
 * Источник: McKinsey, Bain pricing studies
 */
export const ELASTICITY_MODELS: Record<string, ElasticityModel> = {
   // SaaS: более чувствительны к цене, много конкурентов
   saas_low: {
      industry: 'saas',
      priceElasticity: -0.8, // 1% рост цены = 0.8% падение спроса
      demandCurve: (price: number) => 1000 * Math.pow(price, -0.8),
   },
   saas_medium: {
      industry: 'saas',
      priceElasticity: -1.2,
      demandCurve: (price: number) => 1000 * Math.pow(price, -1.2),
   },
   saas_high: {
      industry: 'saas',
      priceElasticity: -1.8,
      demandCurve: (price: number) => 1000 * Math.pow(price, -1.8),
   },

   // Agency: средняя чувствительность, есть лояльность
   agency_low: {
      industry: 'agency',
      priceElasticity: -0.6,
      demandCurve: (price: number) => 500 * Math.pow(price, -0.6),
   },
   agency_medium: {
      industry: 'agency',
      priceElasticity: -1.0,
      demandCurve: (price: number) => 500 * Math.pow(price, -1.0),
   },

   // Infrastructure: низкая чувствительность, высокие switching costs
   infrastructure_low: {
      industry: 'infrastructure',
      priceElasticity: -0.4,
      demandCurve: (price: number) => 2000 * Math.pow(price, -0.4),
   },
   infrastructure_medium: {
      industry: 'infrastructure',
      priceElasticity: -0.7,
      demandCurve: (price: number) => 2000 * Math.pow(price, -0.7),
   },
};

/**
 * Выбор модели эластичности на основе отрасли и конкурентности
 */
export const selectElasticityModel = (
   industry: 'saas' | 'agency' | 'infrastructure',
   competitiveness: 'low' | 'medium' | 'high'
): ElasticityModel => {
   // ИСПОЛЬЗУЕМ ОБРАТНЫЕ КАВЫЧКИ (БЭКТИКИ)
   const key = `${industry}_${competitiveness}`;
   return ELASTICITY_MODELS[key] || ELASTICITY_MODELS['saas_medium'];
};

/**
 * Расчет кривой спроса
 */
export const generateDemandCurve = (
   elasticityModel: ElasticityModel,
   priceRange: { min: number; max: number },
   steps: number = 50
): Array<{ price: number; demand: number }> => {
   const step = (priceRange.max - priceRange.min) / steps;
   const curve = [];

   for (let price = priceRange.min; price <= priceRange.max; price += step) {
      curve.push({
         price: Math.round(price * 100) / 100,
         demand: elasticityModel.demandCurve(price),
      });
   }

   return curve;
};

/**
 * Расчет точки максимизации выручки на кривой спроса
 */
export const findRevenueMaximizingPrice = (
   elasticityModel: ElasticityModel,
   basePrice: number,
   priceRange: { min: number; max: number }
): { optimalPrice: number; maxRevenue: number } => {
   const curve = generateDemandCurve(elasticityModel, priceRange, 100);

   let maxRevenue = 0;
   let optimalPrice = basePrice;

   curve.forEach(({ price, demand }) => {
      const revenue = price * demand;
      if (revenue > maxRevenue) {
         maxRevenue = revenue;
         optimalPrice = price;
      }
   });

   return { optimalPrice, maxRevenue };
};

/**
 * Анализ чувствительности цены
 */
export const priceElasticityAnalysis = (
   basePrice: number,
   baseDemand: number,
   elasticity: number,
   priceChangePercent: number
): {
   newPrice: number;
   newDemand: number;
   revenueChange: number;
   elasticity: number;
} => {
   const newPrice = basePrice * (1 + priceChangePercent);
   const demandChange = elasticity * priceChangePercent;
   const newDemand = baseDemand * (1 + demandChange);

   const currentRevenue = basePrice * baseDemand;
   const newRevenue = newPrice * newDemand;
   const revenueChange = ((newRevenue - currentRevenue) / currentRevenue) * 100;

   return {
      newPrice,
      newDemand,
      revenueChange,
      elasticity,
   };
};
