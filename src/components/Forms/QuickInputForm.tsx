// src/components/Forms/QuickInputForm.tsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePricingCalculations } from '../../hooks/usePricingCalculations';
import { useAppStore } from '../../store/appStore';
import { Loader } from '../Common/Loader';

interface QuickInputFormData {
   currentPrice: number;
   currentCustomers: number;
   customerAcquisitionCost: number;
   averageContractLength: number;
   monthlyChurn: number;
   newPrice: number;
   industry: 'saas' | 'agency' | 'infrastructure';
}

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

   // Следим за изменениями для отображения % роста цены
   const currentPriceInput = watch('currentPrice');
   const newPriceInput = watch('newPrice');
   const priceChange = currentPriceInput > 0
      ? ((newPriceInput - currentPriceInput) / currentPriceInput) * 100
      : 0;

   const onSubmit = async (data: QuickInputFormData) => {
      setIsSubmitting(true);

      // Имитируем небольшую задержку для визуализации лоадера (полезно для UX)
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
         const result = calculateRevenueLiftScenario(
            {
               currentPrice: Number(data.currentPrice),
               newPrice: Number(data.newPrice),
               currentCustomers: Number(data.currentCustomers),
               customerAcquisitionCost: Number(data.customerAcquisitionCost),
               averageContractLength: Number(data.averageContractLength),
               priceElasticity: -1.2,
               averageChurn: Number(data.monthlyChurn),
            },
            data.industry
         );

         if (result) {
            setRevenueLiftResults(result);
            setQuickInputData({
               currentPrice: Number(data.currentPrice),
               currentCustomers: Number(data.currentCustomers),
               customerAcquisitionCost: Number(data.customerAcquisitionCost),
               averageContractLength: Number(data.averageContractLength),
               monthlyChurn: Number(data.monthlyChurn),
            });
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
         <h2 className="text-xl font-bold text-gray-800 mb-4">Симулятор выручки</h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Текущая цена */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текущая цена (₽/мес)
               </label>
               <input
                  type="number"
                  {...register('currentPrice', { required: true, min: 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>

            {/* Новая цена */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Новая цена (₽/мес)
               </label>
               <input
                  type="number"
                  {...register('newPrice', { required: true, min: 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
               <p className={`text-sm mt-1 font-semibold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}% к цене
               </p>
            </div>

            {/* Клиенты */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество клиентов
               </label>
               <input
                  type="number"
                  {...register('currentCustomers', { required: true, min: 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>

            {/* Churn */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Месячный Churn (%)
               </label>
               <input
                  type="number"
                  step="0.1"
                  {...register('monthlyChurn', { required: true, min: 0, max: 100 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>

            {/* Отрасль */}
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-2">
                  Отрасль (влияет на эластичность)
               </label>
               <select
                  {...register('industry')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
               >
                  <option value="saas">SaaS (высокая чувствительность)</option>
                  <option value="agency">Agency (средняя чувствительность)</option>
                  <option value="infrastructure">Infrastructure (низкая чувствительность)</option>
               </select>
            </div>
         </div>

         <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md disabled:bg-blue-300 active:scale-[0.98] flex items-center justify-center min-h-[52px]"
         >
            {isSubmitting ? (
               <div className="flex items-center gap-3">
                  <Loader size="sm" />
                  <span>Выполняем расчет...</span>
               </div>
            ) : (
               'Рассчитать Revenue Lift'
            )}
         </button>
      </form>
   );
};
