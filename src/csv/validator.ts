import type { CSVRow } from './types';

export interface ValidationResult {
   isValid: boolean;
   errors: string[];
   warnings: string[];
}

/**
 * Валидация загруженных CSV данных
 */
export const validateCSVData = (rows: CSVRow[]): ValidationResult => {
   const errors: string[] = [];
   const warnings: string[] = [];

   if (rows.length === 0) {
      errors.push('CSV файл не содержит данных');
      return { isValid: false, errors, warnings };
   }

   if (rows.length < 5) {
      warnings.push('Рекомендуется загрузить минимум 5 записей для точного анализа');
   }

   rows.forEach((row, index) => {
      if (!row.customerId || row.customerId.toString().trim() === '') {
         errors.push(`Строка ${index + 2}: отсутствует customerId`);
      }

      if (row.currentPrice === undefined || row.currentPrice <= 0) {
         errors.push(`Строка ${index + 2}: невалидная цена (${row.currentPrice})`);
      }

      if (row.currentPrice > 1000000) {
         warnings.push(`Строка ${index + 2}: необычно высокая цена (${row.currentPrice})`);
      }
   });

   const prices = rows.map((r) => r.currentPrice);
   const maxPrice = Math.max(...prices);
   const minPrice = Math.min(...prices);
   const ratio = maxPrice / minPrice;

   if (ratio > 100) {
      warnings.push(
         `Очень большой разброс цен (${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}). Проверьте валюту и единицы измерения.`
      );
   }

   return {
      isValid: errors.length === 0,
      errors,
      warnings,
   };
};

/**
 * Проверка формата файла
 */
export const validateFileFormat = (file: File): ValidationResult => {
   const errors: string[] = [];
   const warnings: string[] = [];

   const validExtensions = ['.csv', '.xlsx', '.xls'];
   const fileName = file.name.toLowerCase();
   const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));

   if (!hasValidExtension) {
      errors.push('Неподдерживаемый формат файла. Используйте CSV, XLSX или XLS.');
   }

   const maxSize = 10 * 1024 * 1024;
   if (file.size > maxSize) {
      errors.push('Размер файла превышает 10MB');
   }

   if (file.size === 0) {
      errors.push('Файл пуст');
   }

   return {
      isValid: errors.length === 0,
      errors,
      warnings,
   };
};
