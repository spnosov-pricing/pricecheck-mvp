import React from 'react';
import type { ReportData } from '../../core/types';

interface ExportSectionProps {
   reportData: ReportData;
   isPremium: boolean;
}

export const ExportSection: React.FC<ExportSectionProps> = ({ reportData, isPremium }) => {
   return (
      <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl flex justify-between items-center">
         <div>
            <h3 className="text-xl font-bold">
               Отчет для {reportData.brandName} готов
            </h3>
            <p className="text-blue-100">
               {isPremium
                  ? 'Ваш профессиональный PDF доступен для скачивания'
                  : 'Обновитесь до PRO, чтобы скачать детализированный анализ'}
            </p>
         </div>
         <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-black hover:bg-blue-50 transition-colors">
            {isPremium ? 'СКАЧАТЬ PDF' : 'КУПИТЬ PRO'}
         </button>
      </div>
   );
};

export default ExportSection;
