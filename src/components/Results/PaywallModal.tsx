// src/components/Results/PaywallModal.tsx
import React from 'react';

interface PaywallModalProps {
   isOpen: boolean;
   onClose: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ isOpen, onClose }) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
         <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-600 p-8 text-center text-white relative">
               <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl">&times;</button>
               <div className="text-5xl mb-4">📄</div>
               <h3 className="text-2xl font-black">PRO Отчет</h3>
               <p className="text-blue-100 mt-2">Экспортируйте детальный план возврата прибыли в PDF</p>
            </div>

            <div className="p-8">
               <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-700">
                     <span className="text-green-500 font-bold">✓</span> Построчный анализ всех клиентов
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                     <span className="text-green-500 font-bold">✓</span> Графики эластичности для презентаций
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                     <span className="text-green-500 font-bold">✓</span> Шаблоны писем об индексации цен
                  </li>
               </ul>

               <div className="bg-gray-50 p-4 rounded-2xl mb-6 flex justify-between items-center border border-gray-100">
                  <div>
                     <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Тариф PRO</p>
                     <p className="text-2xl font-black text-gray-900">2 900 ₽ <span className="text-sm font-normal text-gray-500">/ мес</span></p>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">-30% сегодня</div>
               </div>

               <button
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                  onClick={() => alert('Интеграция с эквайрингом в разработке. Спасибо за интерес к MVP!')}
               >
                  Разблокировать экспорт
               </button>
               <p className="text-center text-xs text-gray-400 mt-4">Оплата картой РФ / СБП / Счет для юрлиц</p>
            </div>
         </div>
      </div>
   );
};
