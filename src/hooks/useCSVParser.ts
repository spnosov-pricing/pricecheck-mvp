import { useState, useCallback } from 'react';
// ИСПРАВЛЕНО: Удален неиспользуемый detectCSVDelimiter
import { loadAndParseCSVFile } from '../csv/parser';
import { analyzeCSVData } from '../csv/anomaly';
import { validateCSVData } from '../csv/validator';
// ИСПРАВЛЕНО: Удален неиспользуемый CSVRow и добавлен префикс type
import type { CSVAnalysisResult, ParsedCSVData } from '../csv/types';

export const useCSVParser = () => {
   const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null);
   const [analysis, setAnalysis] = useState<CSVAnalysisResult | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const parseFile = useCallback(async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
         const parsed = await loadAndParseCSVFile(file);
         setParsedData(parsed);

         if (parsed.rows.length > 0) {
            const validation = validateCSVData(parsed.rows);
            if (!validation.isValid) {
               setError(validation.errors.join('; '));
               return;
            }

            const csvAnalysis = analyzeCSVData(parsed.rows);
            setAnalysis(csvAnalysis);
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Ошибка парсинга файла');
      } finally {
         setIsLoading(false);
      }
   }, []);

   const reset = useCallback(() => {
      setParsedData(null);
      setAnalysis(null);
      setError(null);
   }, []);

   return {
      parsedData,
      analysis,
      isLoading,
      error,
      parseFile,
      reset,
   };
};
