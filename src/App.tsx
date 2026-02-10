// src/App.tsx
import { useState } from 'react';
import { QuickInputForm } from './components/Forms/QuickInputForm';
import { CSVUploader } from './components/Forms/CSVUploader';
import { RevenueChart } from './components/Results/RevenueChart';
import { AnomalyTable } from './components/Results/AnomalyTable';
import { ValuePropTester } from './components/Forms/ValuePropTester'; // Новый импорт
import { useAppStore } from './store/appStore';
import { DiagnosticQuiz } from './components/Quiz/DiagnosticQuiz';

function App() {
  const { currentTab, setCurrentTab } = useAppStore();
  // По умолчанию false, чтобы пользователь сначала увидел квиз
  const [isDiagnosed, setIsDiagnosed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">₽</div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">PriceCheck <span className="text-blue-600">MVP</span></h1>
            <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm border border-amber-200">PRO</span>
          </div>

          {/* Навигация скрыта до завершения диагностики */}
          {isDiagnosed && (
            <nav className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 gap-1">
              <button
                onClick={() => setCurrentTab('quick-input')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentTab === 'quick-input' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Симулятор
              </button>
              <button
                onClick={() => setCurrentTab('csv-upload')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentTab === 'csv-upload' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Утечки выручки
              </button>
              <button
                onClick={() => setCurrentTab('value-prop')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentTab === 'value-prop' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Оффер-тестер
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!isDiagnosed ? (
          <DiagnosticQuiz onComplete={() => setIsDiagnosed(true)} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-700">
            <section className="space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-800 uppercase tracking-wider">
                  {currentTab === 'quick-input' && '📝 Параметры бизнеса'}
                  {currentTab === 'csv-upload' && '📁 Загрузка базы клиентов'}
                  {currentTab === 'value-prop' && '🎯 Тест оффера'}
                </h2>

                {currentTab === 'quick-input' && <QuickInputForm />}

                {currentTab === 'csv-upload' && (
                  <>
                    <CSVUploader />
                    <AnomalyTable />
                  </>
                )}

                {currentTab === 'value-prop' && <ValuePropTester />}
              </div>
            </section>

            <section className="space-y-6 lg:sticky lg:top-28">
              <RevenueChart />
              <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">📈</div>
                <h3 className="text-xl font-black mb-3 flex items-center gap-2">
                  {currentTab === 'value-prop' ? 'Зачем это нужно?' : 'Алгоритм анализа'}
                </h3>
                <p className="text-blue-50 leading-relaxed font-medium">
                  {currentTab === 'value-prop'
                    ? 'Сильный оффер превращает "просто продукт" в решение конкретной боли клиента. Без этого даже идеальная воронка не будет работать.'
                    : 'Система находит клиентов, которые платят ниже рыночной цены. Мы рассчитываем упущенную выгоду при индексации до нормы.'
                  }
                </p>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
