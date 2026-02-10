import { create } from 'zustand';
import type { AppState } from './types';

export const useAppStore = create<AppState>((set) => ({
   quickInputData: null,
   csvData: null,
   csvAnalysis: null,
   revenueLiftResults: null,
   inflationImpact: null,
   ltvProjection: null,
   currentTab: 'quick-input',
   isLoading: false,
   error: null,

   setQuickInputData: (data) => set({ quickInputData: data }),
   setCSVData: (data) => set({ csvData: data }),
   setCSVAnalysis: (analysis) => set({ csvAnalysis: analysis }),
   setRevenueLiftResults: (results) => set({ revenueLiftResults: results }),
   setInflationImpact: (impact) => set({ inflationImpact: impact }),
   setLTVProjection: (projection) => set({ ltvProjection: projection }),
   setCurrentTab: (tab) => set({ currentTab: tab }),
   setLoading: (loading) => set({ isLoading: loading }),
   setError: (error) => set({ error }),

   reset: () =>
      set({
         quickInputData: null,
         csvData: null,
         csvAnalysis: null,
         revenueLiftResults: null,
         inflationImpact: null,
         ltvProjection: null,
         error: null,
      }),
}));
