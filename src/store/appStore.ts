import { create } from 'zustand';
import type { RevenueLiftResult, PricingData, CSVAnalysisResult, CSVRow, PricingPlaybook } from '../core/types';

interface AppState {
   currentTab: string;
   setCurrentTab: (tab: string) => void;
   quickInputData: any | null;
   setQuickInputData: (data: any) => void;
   revenueLiftResults: RevenueLiftResult | null;
   setRevenueLiftResults: (results: RevenueLiftResult) => void;
   csvData: CSVRow[] | null;
   setCSVData: (data: CSVRow[]) => void;
   csvAnalysis: CSVAnalysisResult | null;
   setCSVAnalysis: (analysis: CSVAnalysisResult) => void;
   selectedPlaybook: PricingPlaybook | null;
   setSelectedPlaybook: (p: PricingPlaybook | null) => void;
   inflationSector: string;
   inflationRegion: string;
}

export const useAppStore = create<AppState>((set) => ({
   currentTab: 'quick-input',
   setCurrentTab: (tab) => set({ currentTab: tab }),
   quickInputData: null,
   setQuickInputData: (data) => set({ quickInputData: data }),
   revenueLiftResults: null,
   setRevenueLiftResults: (results) => set({ revenueLiftResults: results }),
   csvData: null,
   setCSVData: (data) => set({ csvData: data }),
   csvAnalysis: null,
   setCSVAnalysis: (analysis) => set({ csvAnalysis: analysis }),
   selectedPlaybook: null,
   setSelectedPlaybook: (p) => set({ selectedPlaybook: p }),
   inflationSector: 'Technology',
   inflationRegion: 'RU',
}));
