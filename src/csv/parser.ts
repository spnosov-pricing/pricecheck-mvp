import type { CSVRow, ParsedCSVData, CSVParseError } from './types';

/**
 * Парсинг CSV файла с поддержкой различных форматов
 */
export const parseCSV = (
   fileContent: string,
   delimiter: string = ','
): ParsedCSVData => {
   const lines = fileContent.trim().split('\n');

   if (lines.length < 2) {
      return {
         rows: [],
         totalRows: 0,
         validRows: 0,
         errors: [{ rowIndex: 0, field: 'file', value: null, error: 'CSV файл пуст' }],
      };
   }

   const headers = parseCSVLine(lines[0], delimiter);
   const requiredFields = ['customerId', 'currentPrice'];

   const missingFields = requiredFields.filter(
      (field) => !headers.some((h) => normalizeHeaderName(h) === field)
   );

   if (missingFields.length > 0) {
      return {
         rows: [],
         totalRows: 0,
         validRows: 0,
         errors: [
            {
               rowIndex: 0,
               field: 'headers',
               value: headers,
               error: `Отсутствуют обязательные поля: ${missingFields.join(', ')}`,
            },
         ],
      };
   }

   const rows: CSVRow[] = [];
   const errors: CSVParseError[] = [];

   for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
         const values = parseCSVLine(line, delimiter);
         const row = mapRowToObject(headers, values, i);
         rows.push(row);
      } catch (error) {
         errors.push({
            rowIndex: i,
            field: 'row',
            value: line,
            error: error instanceof Error ? error.message : 'Ошибка парсинга строки',
         });
      }
   }

   return {
      rows,
      totalRows: lines.length - 1,
      validRows: rows.length,
      errors,
   };
};

const parseCSVLine = (line: string, delimiter: string = ','): string[] => {
   const result: string[] = [];
   let current = '';
   let insideQuotes = false;

   for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
         if (insideQuotes && nextChar === '"') {
            current += '"';
            i++;
         } else {
            insideQuotes = !insideQuotes;
         }
      } else if (char === delimiter && !insideQuotes) {
         result.push(current.trim());
         current = '';
      } else {
         current += char;
      }
   }

   result.push(current.trim());
   return result;
};

const normalizeHeaderName = (header: string): string => {
   return header
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .replace(/^(customer|client)/, '')
      .replace(/^(price|amount|cost)/, 'price')
      .replace(/^(id|identifier)/, 'id')
      .replace(/^(name|title)/, 'name')
      .replace(/^(churn|attrition)/, 'churn')
      .replace(/^(date|start)/, 'date')
      .replace(/^(seat|user|member)/, 'seats')
      .replace(/^(usage|consumption|volume)/, 'usage');
};

const mapRowToObject = (
   headers: string[],
   values: string[],
   rowIndex: number
): CSVRow => {
   const row: any = {};

   headers.forEach((header, index) => {
      const normalizedHeader = normalizeHeaderName(header);
      const value = values[index] || '';

      if (normalizedHeader === 'id' || normalizedHeader === 'customerid') {
         row.customerId = value;
      } else if (normalizedHeader === 'name' || normalizedHeader === 'customername') {
         row.customerName = value;
      } else if (normalizedHeader === 'price' || normalizedHeader === 'currentprice') {
         const numValue = parseFloat(value);
         if (isNaN(numValue)) {
            throw new Error(`Невалидная цена в строке ${rowIndex}: "${value}"`);
         }
         row.currentPrice = numValue;
      } else if (normalizedHeader === 'churn' || normalizedHeader === 'monthlychurn') {
         const numValue = parseFloat(value);
         row.monthlyChurn = isNaN(numValue) ? 0.02 : numValue / 100;
      } else if (normalizedHeader === 'date' || normalizedHeader === 'contractstartdate') {
         row.contractStartDate = value;
      } else if (normalizedHeader === 'seats') {
         const numValue = parseInt(value, 10);
         row.seats = isNaN(numValue) ? 1 : numValue;
      } else if (normalizedHeader === 'usage') {
         const numValue = parseFloat(value);
         row.usage = isNaN(numValue) ? 0 : numValue;
      } else {
         row[normalizedHeader] = value;
      }
   });

   if (!row.customerId) {
      throw new Error(`Отсутствует customerId в строке ${rowIndex}`);
   }
   if (row.currentPrice === undefined) {
      throw new Error(`Отсутствует currentPrice в строке ${rowIndex}`);
   }

   return row as CSVRow;
};

export const loadAndParseCSVFile = async (
   file: File,
   delimiter: string = ','
): Promise<ParsedCSVData> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
         try {
            const content = event.target?.result as string;
            const result = parseCSV(content, delimiter);
            resolve(result);
         } catch (error) {
            reject(error);
         }
      };

      reader.onerror = () => reject(new Error('Ошибка при чтении файла'));
      reader.readAsText(file);
   });
};

export const detectCSVDelimiter = (fileContent: string): string => {
   const firstLine = fileContent.split('\n')[0];
   const delimiters = [',', ';', '\t', '|'];

   let maxCount = 0;
   let detectedDelimiter = ',';

   delimiters.forEach((delimiter) => {
      const count = (firstLine.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
      if (count > maxCount) {
         maxCount = count;
         detectedDelimiter = delimiter;
      }
   });

   return detectedDelimiter;
};
