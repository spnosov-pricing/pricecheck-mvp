// src/components/Quiz/DiagnosticQuiz.tsx
import React, { useState } from 'react';

// Расширяем типы шагов для всей карты
type QuizStep =
   | 'intro'
   | 'q_sales_exist'
   | 'q_funnel_bottleneck'
   | 'q_high_check'
   | 'q_market_capacity'
   | 'q_product_ready'
   | 'q_custdev_done'
   | 'q_feedback_type'
   | 'result';

export const DiagnosticQuiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
   const [step, setStep] = useState<QuizStep>('intro');
   const [diagnosis, setDiagnosis] = useState<string>('');
   const [recommendation, setRecommendation] = useState<{ title: string, action: string }>({
      title: 'Инструменты анализа',
      action: 'Открыть систему'
   });

   const renderIntro = () => (
      <div className="text-center space-y-6 max-w-2xl mx-auto py-10">
         <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 text-white rounded-3xl text-4xl shadow-xl mb-4">📈</div>
         <h2 className="text-4xl font-black text-gray-900 leading-tight">Найдем вашу точку роста за 1 минуту</h2>
         <p className="text-gray-600 text-xl leading-relaxed">
            Мы проанализируем ваш проект по методологии <b>Sales Growth Map</b>.
            Узнайте, почему продажи не растут x2-x5 и что нужно «подкрутить» прямо сейчас.
         </p>
         <button
            onClick={() => setStep('q_sales_exist')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] text-lg"
         >
            Начать диагностику →
         </button>
      </div>
   );

   const renderQuestion = (title: string, options: { label: string, next: QuizStep, diag?: string, rec?: { title: string, action: string } }[]) => (
      <div className="space-y-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <h3 className="text-2xl font-black text-gray-800 text-center mb-8">{title}</h3>
         <div className="grid gap-4 max-w-xl mx-auto">
            {options.map((opt, i) => (
               <button
                  key={i}
                  onClick={() => {
                     if (opt.diag) setDiagnosis(opt.diag);
                     if (opt.rec) setRecommendation(opt.rec);
                     setStep(opt.next);
                  }}
                  className="text-left p-6 border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all group shadow-sm hover:shadow-md"
               >
                  <span className="text-lg font-bold text-gray-700 group-hover:text-blue-700">{opt.label}</span>
               </button>
            ))}
         </div>
      </div>
   );

   return (
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 min-h-[550px] flex flex-col justify-center">
         {step === 'intro' && renderIntro()}

         {/* --- ГЛАВНАЯ РАЗВИЛКА --- */}
         {step === 'q_sales_exist' && renderQuestion('Продажи есть?', [
            { label: 'Да, есть регулярные продажи', next: 'q_funnel_bottleneck' },
            { label: 'Нет, продаж пока нет', next: 'q_product_ready' }
         ])}

         {/* --- ВЕТКА: ПРОДАЖ НЕТ (Уже реализовано) --- */}
         {step === 'q_product_ready' && renderQuestion('У вас уже есть готовый продукт?', [
            { label: 'Да, продукт готов / MVP', next: 'q_custdev_done' },
            { label: 'Нет, пока только идея', next: 'result', diag: 'Ловушка "Пилильщика". Вы боитесь рынка. Срочно идите к клиентам с оффером на салфетке.', rec: { title: 'CustDev Модуль', action: 'Проверить гипотезу' } }
         ])}

         {step === 'q_custdev_done' && renderQuestion('Вы пробовали выходить на клиентов?', [
            { label: 'Да, общались с рынком', next: 'q_feedback_type' },
            { label: 'Нет, не пробовали', next: 'result', diag: 'Проблема не подтверждена. Вы рискуете сделать ненужный продукт. Нужен быстрый CustDev.', rec: { title: 'Скрипты интервью', action: 'Изучить' } }
         ])}

         {step === 'q_feedback_type' && renderQuestion('Что говорят клиенты?', [
            { label: 'Продукт не решает их боль', next: 'result', diag: 'Оффер "мимо". Ваше решение не попадает в потребность. Нужен пивот или исследование задач.', rec: { title: 'Value Prop Canvas', action: 'Пересобрать оффер' } },
            { label: 'Это не их приоритет', next: 'result', diag: 'Ошибка в сегменте. Вы предлагаете решение тем, у кого сейчас "не болит". Смените ЦА.', rec: { title: 'Сегментация', action: 'Найти "горячих"' } }
         ])}

         {/* --- ВЕТКА: ПРОДАЖИ ЕСТЬ (НОВОЕ) --- */}
         {step === 'q_funnel_bottleneck' && renderQuestion('В воронке есть "затыки" (конверсия ниже x2-x3)?', [
            { label: 'Да, лиды приходят, но не покупают', next: 'result', diag: 'Проблема в донесении ценности или квалификации. Лиды "холодные" или менеджеры не умеют продавать.', rec: { title: 'Анализ конверсии', action: 'Найти узкое место' } },
            { label: 'Нет, в воронке всё ровно', next: 'q_high_check' }
         ])}

         {step === 'q_high_check' && renderQuestion('Пробовали ли вы существенно повышать чек?', [
            { label: 'Нет, боимся потерять клиентов', next: 'result', diag: 'Точка роста в цене! Скорее всего, вы недозарабатываете 20-30% прибыли из-за "страха цены".', rec: { title: 'Поиск утечек выручки', action: 'Загрузить CSV' } },
            { label: 'Да, но покупают хуже', next: 'q_market_capacity' }
         ])}

         {step === 'q_market_capacity' && renderQuestion('Занята ли вся емкость вашего текущего сегмента?', [
            { label: 'Да, мы лидеры в этой нише', next: 'result', diag: 'Потолок в текущем продукте. Нужно расширять продуктовую линейку или выходить в смежные ниши.', rec: { title: 'Simulator What-If', action: 'Просчитать новые рынки' } },
            { label: 'Нет, клиентов еще много', next: 'result', diag: 'Проблема в трафике или масштабировании продаж. У вас рабочий продукт, просто лейте больше бензина в воронку.', rec: { title: 'Scale Calculator', action: 'Считать бюджет' } }
         ])}

         {/* --- ИТОГОВЫЙ РЕЗУЛЬТАТ --- */}
         {step === 'result' && (
            <div className="space-y-8 py-6 animate-in zoom-in duration-500 max-w-3xl mx-auto">
               <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[32px] shadow-inner">
                  <h3 className="text-2xl font-black text-amber-800 mb-4 flex items-center gap-2">
                     <span>📋</span> Диагноз вашего проекта:
                  </h3>
                  <p className="text-amber-900 text-xl font-medium leading-relaxed">{diagnosis}</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white border border-gray-200 rounded-3xl shadow-sm">
                     <h4 className="font-black text-blue-600 mb-4 uppercase text-sm tracking-widest">Следующий шаг:</h4>
                     <p className="text-gray-600 font-medium">Согласно карте, вам нужно сфокусироваться на этой задаче, чтобы получить x2 в выручке.</p>
                  </div>
                  <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl flex flex-col justify-between">
                     <div>
                        <h4 className="font-black mb-2 uppercase text-sm tracking-widest opacity-80">Рекомендуем:</h4>
                        <p className="text-lg font-bold leading-tight mb-6">{recommendation.title}</p>
                     </div>
                     <button
                        onClick={onComplete}
                        className="w-full bg-white text-blue-600 font-black py-4 rounded-xl shadow-lg hover:bg-blue-50 transition-colors"
                     >
                        {recommendation.action}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};
