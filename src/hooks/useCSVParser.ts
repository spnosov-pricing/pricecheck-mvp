// src/hooks/useCSVParser.ts
import { useState, useCallback } from 'react';
import { loadAndParseCSVFile } from '../csv/parser';
import { analyzeCSVData } from '../csv/anomaly';
import { validateCSVData } from '../csv/validator';
import type { CSVAnalysisResult, CSVRow } from '../csv/types';

export interface ParseResult {
   rows: CSVRow[];
   analysis: CSVAnalysisResult;
   errors: string[];
}

export const useCSVParser = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const parseFile = useCallback(
      async (file: File): Promise<ParseResult | null> => {
         setIsLoading(true);
         setError(null);

         try {
            const parsed = await loadAndParseCSVFile(file);

            const validation = validateCSVData(parsed.rows);
            if (!validation.isValid) {
               const errorMsg = validation.errors.join('; ');
               setError(errorMsg);
               return null;
            }

            const csvAnalysis = analyzeCSVData(parsed.rows);

            return {
               rows: parsed.rows,
               analysis: csvAnalysis,
               errors: validation.warnings,
            };
         } catch (err) {
            const message =
               err instanceof Error ? err.message : 'Ошибка парсинга файла';
            setError(message);
            return null;
         } finally {
            setIsLoading(false);
         }
      },
      []
   );

   return {
      isLoading,
      error,
      parseFile,
   };
};
