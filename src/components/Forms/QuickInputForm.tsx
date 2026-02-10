// src/components/Forms/QuickInputForm.tsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePricingCalculations } from '../../hooks/usePricingCalculations';
import { useAppStore } from '../../store/appStore';
import { Loader } from '../Common/Loader';

// Интерфейс данных формы
interface QuickInputFormData {
   currentPrice: number;
   currentCustomers: number;
   customerAcquisitionCost: number;
   averageContractLength: number;
   monthlyChurn: number;
   newPrice: number;
   industry: 'saas' | 'agency' | 'infrastructure';
}

// ИМЕНОВАННЫЙ ЭКСПОРТ (устраняет ошибку ts(2305) в App.tsx)
export const QuickInputForm: React.FC = () => {
   const { register, handleSubmit, watch } = useForm<QuickInputFormData>({
      defaultValues: {
         currentPrice: 5000,
         currentCustomers: 100,
         customerAcquisitionCost: 2000,
         averageContractLength: 12,
         monthlyChurn: 5,
         newPrice: 6500,
         industry: 'saas',
      },
   });

   const { calculateRevenueLiftScenario } = usePricingCalculations();
   const { setRevenueLiftResults, setQuickInputData } = useAppStore();
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Расчет процента изменения цены для UI
   const currentPriceInput = watch('currentPrice');
   const newPriceInput = watch('newPrice');
   const priceChange = currentPriceInput > 0
      ? ((newPriceInput - currentPriceInput) / currentPriceInput) * 100
      : 0;

   const onSubmit = async (data: QuickInputFormData) => {
      setIsSubmitting(true);

      // Имитация задержки для UX
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
         // Передаем данные в хук расчета (теперь все поля соответствуют PricingScenario)
         const result = calculateRevenueLiftScenario(
            {
               currentPrice: Number(data.currentPrice),
               newPrice: Number(data.newPrice),
               currentCustomers: Number(data.currentCustomers),
               customerAcquisitionCost: Number(data.customerAcquisitionCost),
               averageContractLength: Number(data.averageContractLength),
               priceElasticity: -1.2, // Базовая эластичность, уточняется в хуке
               averageChurn: Number(data.monthlyChurn),
            },
            data.industry
         );

         if (result) {
            setRevenueLiftResults(result);
            // Сохраняем данные в глобальный стор
            setQuickInputData({
               currentPrice: Number(data.currentPrice),
               currentCustomers: Number(data.currentCustomers),
               customerAcquisitionCost: Number(data.customerAcquisitionCost),
               averageContractLength: Number(data.averageContractLength),
               monthlyChurn: Number(data.monthlyChurn),
               // Добавляем обязательные поля для PricingData, если они требуются
               currency: '₽',
               lastUpdateDate: new Date()
            });
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Текущая цена */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Текущая цена (₽/мес)
               </label>
               <input
                  type="number"
                  {...register('currentPrice', { required: true, min: 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
               />
            </div>

            {/* Новая цена */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Новая цена (₽/мес)
               </label>
               <input
                  type="number"
                  {...register('newPrice', { required: true, min: 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
               />
               <p className={`text-xs mt-2 font-black ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange > 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(1)}% к текущей цене
               </p>
            </div>

            {/* Клиенты */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Всего клиентов
               </label>
               <input
                  type="number"
                  {...register('currentCustomers', { required: true, min: 1 })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
               />
            </div>

            {/* CAC */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  CAC (Привлечение, ₽)
               </label>
               <input
                  type="number"
                  {...register('customerAcquisitionCost', { required: true, min: 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
               />
            </div>

            {/* Churn */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Месячный Churn (%)
               </label>
               <input
                  type="number"
                  step="0.1"
                  {...register('monthlyChurn', { required: true, min: 0, max: 100 })}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all font-medium"
               />
            </div>

            {/* Отрасль */}
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Отрасль бизнеса
               </label>
               <select
                  {...register('industry')}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none bg-white font-medium cursor-pointer"
               >
                  <option value="saas">SaaS (Высокая чувствительность)</option>
                  <option value="agency">Agency (Средняя)</option>
                  <option value="infrastructure">Infrastructure (Низкая)</option>
               </select>
            </div>
         </div>

         <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:bg-blue-300 active:scale-[0.98] flex items-center justify-center min-h-[60px] text-lg uppercase tracking-widest"
         >
            {isSubmitting ? (
               <div className="flex items-center gap-3">
                  <Loader size="sm" />
                  <span>Просчитываем сценарий...</span>
               </div>
            ) : (
               'Рассчитать рост выручки'
            )}
         </button>
      </form>
   );
};
