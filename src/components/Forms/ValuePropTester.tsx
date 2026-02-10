// src/components/Forms/ValuePropTester.tsx
import React, { useState } from 'react';

const HYPOTHESES = [
   {
      segment: 'B2B SaaS компании на стадии роста',
      problem: 'Тратят сотни тысяч на рекламу, но не понимают, какой канал реально приносит прибыль',
      solution: 'Модуль сквозной аналитики с AI-прогнозированием LTV',
      benefit: 'Рост окупаемости маркетинга (ROMI) на 35% за первый квартал'
   },
   {
      segment: 'Digital-агентства с чеком от 100к',
      problem: 'Клиенты уходят через 3 месяца из-за отсутствия прозрачных результатов',
      solution: 'Автоматизированный дашборд отчетности в реальном времени',
      benefit: 'Увеличение LTV клиента на 50% и снижение времени на отчеты в 4 раза'
   },
   {
      segment: 'Владельцы онлайн-школ',
      problem: 'Высокая стоимость привлечения лида (CAC) и низкая доходимость до конца курса',
      solution: 'Игровая механика обучения с персональным ИИ-наставником',
      benefit: 'Повышение конверсии в покупку следующего продукта на 25%'
   }
];

export const ValuePropTester: React.FC = () => {
   const [formData, setFormData] = useState({
      segment: '',
      problem: '',
      solution: '',
      benefit: ''
   });

   const generateRandom = () => {
      const random = HYPOTHESES[Math.floor(Math.random() * HYPOTHESES.length)];
      setFormData(random);
   };

   const calculateScore = () => {
      let score = 0;
      if (formData.segment.trim().length > 10) score += 25;
      if (formData.problem.trim().length > 20) score += 25;
      if (formData.solution.trim().length > 10) score += 25;
      const hasMetrics = /[%₽$]|(день|мес|год|час)/i.test(formData.benefit);
      if (hasMetrics && formData.benefit.length > 5) score += 25;
      return score;
   };

   const score = calculateScore();

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl flex justify-between items-start">
            <div className="max-w-[70%]">
               <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🎯</span>
                  <h3 className="text-indigo-800 font-black uppercase text-sm tracking-widest">Тест оффера</h3>
               </div>
               <p className="text-indigo-700 text-sm leading-relaxed font-medium">
                  Сформулируйте ценность вашего продукта. Сильный оффер — это 80% успеха в продажах.
               </p>
            </div>
            <button
               onClick={generateRandom}
               className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-xs font-black shadow-sm hover:bg-indigo-100 transition-all active:scale-95"
            >
               🎲 ГЕНЕРИРОВАТЬ ПРИМЕР
            </button>
         </div>

         <div className="grid gap-5">
            {[
               { id: 'segment', label: 'Для кого это? (Сегмент)', placeholder: 'Напр: Владельцы онлайн-школ...' },
               { id: 'problem', label: 'Какая боль? (Проблема)', placeholder: 'Напр: Тратят бюджет впустую...', isArea: true },
               { id: 'solution', label: 'Что даете? (Решение)', placeholder: 'Напр: Система авто-воронок...' },
               { id: 'benefit', label: 'Что в итоге? (Твердый результат)', placeholder: 'Напр: Рост окупаемости на 40%...' },
            ].map((field) => (
               <div key={field.id} className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider ml-1">{field.label}</label>
                  {field.isArea ? (
                     <textarea
                        value={formData[field.id as keyof typeof formData]}
                        placeholder={field.placeholder}
                        className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none transition-all h-24 shadow-sm"
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                     />
                  ) : (
                     <input
                        type="text"
                        value={formData[field.id as keyof typeof formData]}
                        placeholder={field.placeholder}
                        className="w-full p-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm"
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                     />
                  )}
               </div>
            ))}
         </div>

         {/* Шкала силы оффера */}
         <div className="pt-8 border-t-2 border-dashed border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h4 className="font-black text-gray-900 text-2xl uppercase tracking-tighter">Сила оффера</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase mt-1">Методология Growth Map</p>
               </div>
               <span className={`text-5xl font-black italic ${score > 75 ? 'text-green-500' : score > 40 ? 'text-amber-500' : 'text-red-400'}`}>
                  {score}%
               </span>
            </div>
            <div className="w-full bg-gray-100 h-5 rounded-full overflow-hidden p-1">
               <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${score > 75 ? 'bg-green-500' : score > 40 ? 'bg-amber-500' : 'bg-red-400'
                     }`}
                  style={{ width: `${score}%` }}
               ></div>
            </div>
         </div>
      </div>
   );
};
