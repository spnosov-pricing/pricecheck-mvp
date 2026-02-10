/* src/core/playbooks.ts */
import type { PricingPlaybook, PricingTier, PlaybookTip } from './types'; // Добавлено слово type

const SAAS_TIERS: PricingTier[] = [
   { name: 'Starter', features: ['Core functionality', 'Up to 5 users'], priceRange: '$29-49/mo', targetCustomer: 'Small teams' },
   { name: 'Professional', features: ['Priority support', 'API access'], priceRange: '$99-199/mo', targetCustomer: 'Growing businesses' },
   { name: 'Enterprise', features: ['Custom SLA', 'SSO/SAML'], priceRange: '$499+/mo', targetCustomer: 'Large orgs' }
];

const SAAS_TIPS: PlaybookTip[] = [
   { category: 'Psychology', advice: 'Use $99 instead of $100 for conversion', source: 'Bain' },
   { category: 'Strategy', advice: 'Align price with value metrics, not costs', source: 'McKinsey' }
];

export const PRICING_PLAYBOOKS: PricingPlaybook[] = [
   {
      id: 'saas-subscription',
      category: 'SaaS',
      title: 'SaaS Subscription Model',
      description: 'Tiered pricing optimized for B2B SaaS.',
      recommendedTiers: SAAS_TIERS,
      strategicTips: SAAS_TIPS,
      pricingModel: 'subscription'
   }
   // Можно добавить Agency и Infrastructure по аналогии
];

export const getPlaybookByCategory = (cat: string) => PRICING_PLAYBOOKS.find(p => p.category === cat);
