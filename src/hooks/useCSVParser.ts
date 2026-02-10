// src/hooks/useCSVParser.ts
import { useState, useCallback } from 'react';
import { loadAndParseCSVFile } from '../csv/parser';
import { analyzeCSVData } from '../csv/anomaly';
import { validateCSVData } from '../csv/validator';
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

         if (parsed.rows.length === 0) {
            throw new Error('Файл пуст');
         }

         const validation = validateCSVData(parsed.rows);
         if (!validation.isValid) {
            const errorMsg = validation.errors.join('; ');
            setError(errorMsg);
            return { rows: [], analysis: null, errors: [errorMsg] };
         }

         const csvAnalysis = analyzeCSVData(parsed.rows);

         // Обновляем локальное состояние хука
         setParsedData(parsed);
         setAnalysis(csvAnalysis);

         // ВАЖНО: Возвращаем результат для компонента CSVUploader
         return {
            rows: parsed.rows,
            analysis: csvAnalysis,
            errors: []
         };

      } catch (err) {
         const message = err instanceof Error ? err.message : 'Ошибка парсинга файла';
         setError(message);
         return { rows: [], analysis: null, errors: [message] };
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
