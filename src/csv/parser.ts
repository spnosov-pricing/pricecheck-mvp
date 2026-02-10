import type { ParsedCSVData, CSVRow } from './types';

export const loadAndParseCSVFile = async (file: File): Promise<ParsedCSVData> => {
   const text = await file.text();
   const cleanText = text.replace(/^\uFEFF/, '').trim();

   if (!cleanText) throw new Error('Файл пуст');

   const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
   const delimiter = lines[0].includes(';') ? ';' : ',';
   const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));

   const rows: CSVRow[] = lines.slice(1).map((line) => {
      const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row: any = {};

      headers.forEach((header, index) => {
         const val = values[index];
         // Приводим к числу колонки, которые в интерфейсе CSVRow заявлены как number
         if (['currentPrice', 'monthlyChurn', 'seats', 'usage'].includes(header)) {
            row[header] = val ? Number(val.replace(',', '.')) : 0;
         } else {
            row[header] = val || '';
         }
      });
      return row as CSVRow;
   });

   return {
      rows,
      totalRows: rows.length,
      validRows: rows.length,
      errors: []
   };
};
