// src/components/Results/AnomalyTable.tsx
import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { PaywallModal } from './PaywallModal';

export const AnomalyTable: React.FC = () => {
   const { csvAnalysis } = useAppStore();
   const [showPaywall, setShowPaywall] = useState(false);

   if (!csvAnalysis || csvAnalysis.anomalies.length === 0) return null;

   const formatCurrency = (val: number) =>
      new Intl.NumberFormat('ru-RU', {
         style: 'currency',
         currency: 'RUB',
         maximumFractionDigits: 0,
      }).format(val);

   return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-6">
         <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

         <div className="p-6 border-b border-gray-100 bg-red-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                  <span>⚠️</span> Найдено аномалий: {csvAnalysis.anomalyCount}
               </h3>
               <p className="text-sm text-red-600 mt-1">
                  Общий потенциал:{' '}
                  <span className="font-bold">
                     {formatCurrency(csvAnalysis.potentialRecoveryTotal)}
                  </span>{' '}
                  в год
               </p>
            </div>
            <button
               onClick={() => setShowPaywall(true)}
               className="flex items-center gap-2 bg-white border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors shadow-sm"
            >
               <span>📄</span> Скачать PDF отчет
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                     <th className="px-6 py-3">Клиент</th>
                     <th className="px-6 py-3">Тек. цена</th>
                     <th className="px-6 py-3">Отклонение</th>
                     <th className="px-6 py-3 text-right">Потенциал (год)</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {csvAnalysis.anomalies.slice(0, 5).map((anomaly, idx) => (
                     <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                           {anomaly.customerName}
                        </td>
                        <td className="px-6 py-4">
                           {formatCurrency(anomaly.currentPrice)}
                        </td>
                        <td className="px-6 py-4">
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${anomaly.severity === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-orange-100 text-orange-700'
                                 }`}
                           >
                              -{anomaly.deviationPercent.toFixed(0)}%
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-green-600">
                           +{formatCurrency(anomaly.potentialRecovery)}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {csvAnalysis.anomalies.length > 5 && (
            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
               <button
                  onClick={() => setShowPaywall(true)}
                  className="text-blue-600 font-bold text-xs hover:underline uppercase tracking-widest"
               >
                  Показать еще {csvAnalysis.anomalies.length - 5} аномалий
               </button>
            </div>
         )}
      </div>
   );
};
