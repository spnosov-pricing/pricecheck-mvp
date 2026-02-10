import type { CSVRow, CSVAnalysisResult } from '../csv/types';
import type { RevenueLiftResult, InflationImpact, LTVProjection } from '../core/types';

export interface AppState {
   // Input данные
   quickInputData: {
      currentPrice: number;
      currentCustomers: number;
      customerAcquisitionCost: number;
      averageContractLength: number;
      monthlyChurn: number;
   } | null;

   csvData: CSVRow[] | null;
   csvAnalysis: CSVAnalysisResult | null;

   // Результаты расчетов
   revenueLiftResults: RevenueLiftResult | null;
   inflationImpact: InflationImpact | null;
   ltvProjection: LTVProjection | null;

   // UI состояние
   currentTab: 'quick-input' | 'csv-upload' | 'value-prop' | 'inflation'; // Добавили value-prop вместо templates
   isLoading: boolean;
   error: string | null;

   // Actions
   setQuickInputData: (data: AppState['quickInputData']) => void;
   setCSVData: (data: CSVRow[]) => void;
   setCSVAnalysis: (analysis: CSVAnalysisResult) => void;
   setRevenueLiftResults: (results: RevenueLiftResult) => void;
   setInflationImpact: (impact: InflationImpact) => void;
   setLTVProjection: (projection: LTVProjection) => void;
   setCurrentTab: (tab: AppState['currentTab']) => void;
   setLoading: (loading: boolean) => void;
   setError: (error: string | null) => void;
   reset: () => void;
}
