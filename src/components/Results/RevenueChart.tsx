import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useAppStore } from '../../store/appStore';

export const RevenueChart: React.FC = () => {
   const { revenueLiftResults } = useAppStore();

   if (!revenueLiftResults) {
      return (
         <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
            Нажмите «Рассчитать», чтобы увидеть прогноз
         </div>
      );
   }

   const data = [
      {
         name: 'Текущая выручка',
         value: revenueLiftResults.currentAnnualRevenue,
         color: '#94a3b8',
      },
      {
         name: 'Прогноз выручки',
         value: revenueLiftResults.newAnnualRevenue,
         color: '#2563eb',
      },
   ];

   const formatCurrency = (value: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

   return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
         <h3 className="text-lg font-bold mb-4 text-gray-800">Годовой Revenue Lift</h3>
         <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(val) => `$${val / 1000}k`} />

                  {/* ИСПРАВЛЕНО: добавлена проверка на наличие значения для Tooltip */}
                  <Tooltip
                     formatter={(value: number | string | undefined) => {
                        if (value === undefined) return '';
                        return typeof value === 'number' ? formatCurrency(value) : value;
                     }}
                  />

                  <Legend />
                  <Bar dataKey="value" name="Выручка ($ в год)" radius={[4, 4, 0, 0]}>
                     {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
         <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-800 font-medium">
               Потенциальный рост: <span className="font-bold">+{revenueLiftResults.revenueLiftPercent.toFixed(1)}%</span>
            </p>
            <p className="text-blue-600 text-sm">
               Дополнительная прибыль: {formatCurrency(revenueLiftResults.revenueLift)} в год
            </p>
         </div>
      </div>
   );
};
