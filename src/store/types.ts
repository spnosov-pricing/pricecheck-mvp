import type { PricingPlaybook, PricingData, CalculationResults } from '../core/types'; // Добавлено слово type

export interface AppState {
   // Существующие состояния
   quickInputData: PricingData | null;
   csvData: any[] | null;
   csvAnalysis: any | null;
   revenueLiftResults: CalculationResults | null;
   inflationImpact: any | null;
   ltvProjection: any | null;
   currentTab: string;
   isLoading: boolean;
   error: string | null;

   // НОВЫЕ СОСТОЯНИЯ (Playbooks & Inflation)
   selectedPlaybook: PricingPlaybook | null;
   inflationSector: string;
   inflationRegion: string;

   // Методы управления
   setQuickInputData: (data: PricingData | null) => void;
   setCSVData: (data: any[] | null) => void;
   setCSVAnalysis: (analysis: any) => void;
   setRevenueLiftResults: (results: CalculationResults | null) => void;
   setInflationImpact: (impact: any) => void;
   setLTVProjection: (projection: any) => void;
   setCurrentTab: (tab: string) => void;
   setLoading: (loading: boolean) => void;
   setError: (error: string | null) => void;

   // НОВЫЕ МЕТОДЫ
   setSelectedPlaybook: (playbook: PricingPlaybook | null) => void;
   setInflationSettings: (sector: string, region: string) => void;

   reset: () => void;
}
