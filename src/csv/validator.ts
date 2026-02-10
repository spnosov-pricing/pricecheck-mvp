// src/csv/validator.ts
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

   if (!rows || rows.length === 0) {
      errors.push('CSV файл не содержит данных');
      return { isValid: false, errors, warnings };
   }

   if (rows.length < 5) {
      warnings.push('Рекомендуется загрузить минимум 5 записей для точного анализа');
   }

   rows.forEach((row, index) => {
      // 1. Проверка customerId (в файле C001, C002...)
      if (!row.customerId || String(row.customerId).trim() === '') {
         errors.push(`Строка ${index + 2}: отсутствует customerId`);
      }

      // 2. Превращаем строку в число для валидации цены
      const price = Number(row.currentPrice);

      if (isNaN(price) || price <= 0) {
         errors.push(`Строка ${index + 2}: невалидная цена "${row.currentPrice}" (должна быть числом больше 0)`);
      } else {
         if (price > 1000000) {
            warnings.push(`Строка ${index + 2}: необычно высокая цена (${price})`);
         }
      }
   });

   // 3. Безопасный расчет разброса цен (только для валидных чисел)
   const validPrices = rows
      .map((r) => Number(r.currentPrice))
      .filter((p) => !isNaN(p) && p > 0);

   if (validPrices.length > 0) {
      const maxPrice = Math.max(...validPrices);
      const minPrice = Math.min(...validPrices);
      const ratio = maxPrice / minPrice;

      if (ratio > 100) {
         warnings.push(
            `Очень большой разброс цен (${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}). Проверьте валюту и единицы измерения.`
         );
      }
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

   const validExtensions = ['.csv']; // Для MVP оставим только CSV
   const fileName = file.name.toLowerCase();
   const hasValidExtension = validExtensions.some((ext) => fileName.endsWith(ext));

   if (!hasValidExtension) {
      errors.push('Неподдерживаемый формат файла. Используйте CSV.');
   }

   const maxSize = 10 * 1024 * 1024; // 10MB
   if (file.size > maxSize) {
      errors.push('Размер файла превышает 10MB');
   }

   if (file.size === 0) {
      errors.push('Выбранный файл пуст');
   }

   return {
      isValid: errors.length === 0,
      errors,
      warnings,
   };
};
