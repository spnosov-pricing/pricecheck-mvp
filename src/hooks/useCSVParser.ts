// src/hooks/useCSVParser.ts
import { useState, useCallback } from 'react';
import { loadAndParseCSVFile } from '../csv/parser';
import { analyzeCSVData } from '../csv/anomaly';
import { validateCSVData } from '../csv/validator';
// Исправлено: теперь типы используются явно
import type { CSVAnalysisResult, CSVRow } from '../csv/types';

export const useCSVParser = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const parseFile = useCallback(async (file: File): Promise<{ rows: CSVRow[], analysis: CSVAnalysisResult, errors: string[] } | null> => {
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

         // Теперь TS видит, что мы возвращаем объекты нужных типов
         return {
            rows: parsed.rows,
            analysis: csvAnalysis,
            errors: []
         };

      } catch (err) {
         const message = err instanceof Error ? err.message : 'Ошибка парсинга файла';
         setError(message);
         return null;
      } finally {
         setIsLoading(false);
      }
   }, []);

   return {
      isLoading,
      error,
      parseFile,
   };
};
