// src/store/appStore.ts
import { create } from 'zustand';
import type { AppState } from './types';
import type {
   PricingData,
   RevenueLiftResult,
   PricingPlaybook,
   InflationAdjustment,
   LTVProjection,
} from '../core/types';
import type { CSVRow, CSVAnalysisResult } from '../csv/types';

export const useAppStore = create<AppState>((set) => ({
   // ========== Инициализация состояния ==========
   quickInputData: null,
   csvData: null,
   csvAnalysis: null,
   revenueLiftResults: null,
   inflationImpact: null,
   ltvProjection: null,
   currentTab: 'quick-input',
   isLoading: false,
   error: null,
   selectedPlaybook: null,
   inflationSector: 'IT Services',
   inflationRegion: 'US',

   // ========== Методы управления данными ==========
   setQuickInputData: (data: PricingData | null) =>
      set({ quickInputData: data }),

   setCSVData: (data: CSVRow[] | null) =>
      set({ csvData: data }),
   setCSVAnalysis: (analysis: CSVAnalysisResult | null) =>
      set({ csvAnalysis: analysis }),

   setRevenueLiftResults: (results: RevenueLiftResult | null) =>
      set({ revenueLiftResults: results }),

   setInflationImpact: (impact: InflationAdjustment | null) =>
      set({ inflationImpact: impact }),

   setLTVProjection: (projection: LTVProjection | null) =>
      set({ ltvProjection: projection }),

   // ========== Методы управления UI ==========
   setCurrentTab: (tab: string) =>
      set({ currentTab: tab }),

   setLoading: (loading: boolean) =>
      set({ isLoading: loading }),

   setError: (error: string | null) =>
      set({ error }),

   // ========== Методы управления плейбуками ==========
   setSelectedPlaybook: (playbook: PricingPlaybook | null) =>
      set({ selectedPlaybook: playbook }),

   setInflationSettings: (sector: string, region: string) =>
      set({ inflationSector: sector, inflationRegion: region }),

   // ========== Сброс состояния ==========
   reset: () =>
      set({
         quickInputData: null,
         csvData: null,
         csvAnalysis: null,
         revenueLiftResults: null,
         inflationImpact: null,
         ltvProjection: null,
         selectedPlaybook: null,
         error: null,
      }),
}));
