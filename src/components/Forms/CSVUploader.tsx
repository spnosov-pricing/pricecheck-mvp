// src/components/Forms/CSVUploader.tsx
import React, { useCallback, useState } from 'react';
import { useCSVParser } from '../../hooks/useCSVParser';
import { useAppStore } from '../../store/appStore';
import { Loader } from '../Common/Loader';

export const CSVUploader: React.FC = () => {
   const { parseFile, isLoading, error } = useCSVParser();
   const { setCSVData, setCSVAnalysis } = useAppStore();
   const [isDragOver, setIsDragOver] = useState(false);

   const handleFile = useCallback(
      async (file: File) => {
         const result = await parseFile(file);
         if (result && result.errors.length === 0) {
            setCSVData(result.rows);
            setCSVAnalysis(result.analysis);
         }
      },
      [parseFile, setCSVData, setCSVAnalysis]
   );

   const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
   };

   return (
      <div className="space-y-4">
         <div
            onDragOver={(e) => {
               e.preventDefault();
               setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center text-center ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
               } ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-400 hover:bg-white'
               }`}
         >
            <input
               type="file"
               accept=".csv"
               onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {isLoading ? (
               <Loader label="Ищем скрытую прибыль..." size="md" />
            ) : (
               <>
                  <div className="mb-4 p-4 bg-blue-100 rounded-full text-blue-600 text-2xl">
                     📊
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                     Перетащите ваш CSV файл
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                     Мы проанализируем цены каждого клиента и найдем аномалии
                  </p>
               </>
            )}
         </div>

         {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
               <strong>Ошибка:</strong> {error}
            </div>
         )}
      </div>
   );
};
