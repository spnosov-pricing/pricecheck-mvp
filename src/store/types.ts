// src/store/types.ts
import type {
   PricingPlaybook,
   PricingData,
   RevenueLiftResult,
   InflationAdjustment,
   LTVProjection,
} from '../core/types';
import type { CSVRow, CSVAnalysisResult } from '../csv/types';

export interface AppState {
   // ========== Основные данные ==========
   quickInputData: PricingData | null;
   csvData: CSVRow[] | null;
   csvAnalysis: CSVAnalysisResult | null;
   revenueLiftResults: RevenueLiftResult | null;
   inflationImpact: InflationAdjustment | null;
   ltvProjection: LTVProjection | null;

   // ========== UI состояние ==========
   currentTab: string;
   isLoading: boolean;
   error: string | null;

   // ========== Playbooks & Settings ==========
   selectedPlaybook: PricingPlaybook | null;
   inflationSector: string;
   inflationRegion: string;

   // ========== Методы управления данными ==========
   setQuickInputData: (data: PricingData | null) => void;
   setCSVData: (data: CSVRow[] | null) => void;
   setCSVAnalysis: (analysis: CSVAnalysisResult | null) => void;
   setRevenueLiftResults: (results: RevenueLiftResult | null) => void;
   setInflationImpact: (impact: InflationAdjustment | null) => void;
   setLTVProjection: (projection: LTVProjection | null) => void;

   // ========== Методы управления UI ==========
   setCurrentTab: (tab: string) => void;
   setLoading: (loading: boolean) => void;
   setError: (error: string | null) => void;

   // ========== Методы управления плейбуками ==========
   setSelectedPlaybook: (playbook: PricingPlaybook | null) => void;
   setInflationSettings: (sector: string, region: string) => void;

   // ========== Сброс ==========
   reset: () => void;
}
