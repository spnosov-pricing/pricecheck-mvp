import React, { useState } from 'react';

type Step = 'intro' | 'q_product' | 'q_custdev' | 'q_feedback' | 'result';

export const DiagnosticQuiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
   const [step, setStep] = useState<Step>('intro');
   const [diagnosis, setDiagnosis] = useState<string>('');

   const renderIntro = () => (
      <div className="text-center space-y-6 max-w-2xl mx-auto py-10">
         <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl text-3xl mb-4">🧩</div>
         <h2 className="text-3xl font-black text-gray-900 leading-tight">Найдем вашу точку роста за 1 минуту</h2>
         <p className="text-gray-600 text-lg leading-relaxed">
            Мы проанализируем ваш проект по методологии <b>Sales Growth Map</b>.
            Ответьте на несколько вопросов, чтобы понять, почему продажи не растут и что именно нужно «подкрутить» прямо сейчас.
         </p>
         <button
            onClick={() => setStep('q_product')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02]"
         >
            Начать диагностику →
         </button>
         <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Бесплатно для PRO пользователей</p>
      </div>
   );

   const renderQuestion = (title: string, options: { label: string, next: Step, diag?: string }[]) => (
      <div className="space-y-6 py-6">
         <h3 className="text-2xl font-black text-gray-800">{title}</h3>
         <div className="grid gap-4">
            {options.map((opt, i) => (
               <button
                  key={i}
                  onClick={() => {
                     if (opt.diag) setDiagnosis(opt.diag);
                     setStep(opt.next);
                  }}
                  className="text-left p-5 border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all group"
               >
                  <span className="text-lg font-bold text-gray-700 group-hover:text-blue-700">{opt.label}</span>
               </button>
            ))}
         </div>
      </div>
   );

   const renderResult = () => (
      <div className="space-y-8 py-6">
         <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl">
            <h3 className="text-xl font-black text-amber-800 mb-2">📋 Диагноз вашего проекта:</h3>
            <p className="text-amber-900 text-lg font-medium leading-relaxed">{diagnosis}</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
               <h4 className="font-black text-blue-600 mb-2 uppercase text-sm">Что делать сейчас:</h4>
               <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Приостановить разработку фич</li>
                  <li>• Провести 10 проблемных интервью</li>
                  <li>• Использовать наш <b>Value Proposition Canvas</b></li>
               </ul>
            </div>
            <div className="p-6 bg-blue-600 text-white rounded-2xl shadow-lg">
               <h4 className="font-black mb-2 uppercase text-sm">Рекомендуемый инструмент:</h4>
               <p className="text-sm opacity-90 mb-4">Инструмент валидации гипотез и калькулятор Unit-экономики</p>
               <button onClick={onComplete} className="w-full bg-white text-blue-600 font-bold py-2 rounded-xl text-sm">Открыть инструменты</button>
            </div>
         </div>
      </div>
   );

   return (
      <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 min-h-[500px] flex flex-col justify-center">
         {step === 'intro' && renderIntro()}

         {step === 'q_product' && renderQuestion('У вас уже есть готовый продукт?', [
            { label: 'Да, продукт готов или в MVP', next: 'q_custdev' },
            { label: 'Нет, пока только идея / пилим продукт', next: 'result', diag: 'Вы попали в ловушку "Пилильщика". Продаж нет, потому что вы боитесь выйти к клиентам или не думали об этом.' }
         ])}

         {step === 'q_custdev' && renderQuestion('Вы пробовали выходить на реальных клиентов?', [
            { label: 'Да, ходили и общались', next: 'q_feedback' },
            { label: 'Нет, не пробовали / не смогли выйти', next: 'result', diag: 'Проблема не проверена. Вы рискуете сделать то, что никому не нужно. Нужно срочно качать компетенции CustDev.' }
         ])}

         {step === 'q_feedback' && renderQuestion('Что говорят потенциальные клиенты?', [
            { label: 'Продукт не решает их боль', next: 'result', diag: 'Ваш оффер "мимо". Проблема существует, но ваш продукт её не закрывает. Нужен пивот или глубокое исследование задач клиента.' },
            { label: 'Это не их приоритет / Нет проблемы', next: 'result', diag: 'Вы ошиблись с сегментом (ЦА). Нужно искать тех, у кого эта "боль" горит ярче всего.' },
            { label: 'Просят функции, которых нет', next: 'result', diag: 'Типичный барьер. Скорее всего, вы не донесли ценность того, что уже есть, и клиент ищет отговорки.' }
         ])}

         {step === 'result' && renderResult()}
      </div>
   );
};
