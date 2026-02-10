// src/App.tsx
import { useState, useMemo } from 'react';
import { QuickInputForm } from './components/Forms/QuickInputForm';
import { CSVUploader } from './components/Forms/CSVUploader';
import { RevenueChart } from './components/Results/RevenueChart';
import { AnomalyTable } from './components/Results/AnomalyTable';
import { ValuePropTester } from './components/Forms/ValuePropTester';
import { PlaybookSelector } from './components/Playbooks/PlaybookSelector';
import { ExportSection } from './components/Results/ExportSection';
import { useAppStore } from './store/appStore';
import { DiagnosticQuiz } from './components/Quiz/DiagnosticQuiz';
import { suggestPriceAdjustment } from './core/inflation';
import type { ReportData } from './core/types'; // Добавлено слово type

function App() {
  const {
    currentTab,
    setCurrentTab,
    quickInputData,
    selectedPlaybook,
    inflationSector,
    inflationRegion
  } = useAppStore();

  // По умолчанию false, чтобы пользователь сначала увидел квиз
  const [isDiagnosed, setIsDiagnosed] = useState(false);

  // Подготовка данных для PDF-отчета на основе состояния стора
  const reportData = useMemo((): ReportData | null => {
    if (!quickInputData) return null;

    const adjustment = suggestPriceAdjustment(
      quickInputData.currentPrice,
      quickInputData.lastUpdateDate,
      inflationSector,
      inflationRegion
    );

    return {
      brandName: "My Business", // Здесь можно добавить поле в стор для названия
      currentPricing: {
        price: quickInputData.currentPrice,
        currency: quickInputData.currency || '$',
        lastUpdate: quickInputData.lastUpdateDate,
      },
      recommendedPricing: {
        price: adjustment.suggestedPrice,
        adjustmentReason: adjustment.reasoning,
        inflationImpact: adjustment.adjustmentPercentage,
      },
      selectedPlaybook: selectedPlaybook || undefined,
      comparisonChart: { competitors: [] }, // Для расширения в v2
      generatedDate: new Date(),
    };
  }, [quickInputData, selectedPlaybook, inflationSector, inflationRegion]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">₽</div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">PriceCheck <span className="text-blue-600">MVP</span></h1>
            <span className="ml-2 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter shadow-sm border border-amber-200">PRO</span>
          </div>

          {isDiagnosed && (
            <nav className="hidden md:flex bg-gray-100 p-1 rounded-xl border border-gray-200 gap-1">
              {[
                { id: 'quick-input', label: 'Симулятор' },
                { id: 'csv-upload', label: 'Утечки' },
                { id: 'playbooks', label: 'Стратегии' },
                { id: 'value-prop', label: 'Оффер' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${currentTab === tab.id ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!isDiagnosed ? (
          <DiagnosticQuiz onComplete={() => setIsDiagnosed(true)} />
        ) : (
          <div className="space-y-12 animate-in fade-in duration-700">

            {/* Основная рабочая область */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <section className="space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                  <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-gray-800 uppercase tracking-wider">
                    {currentTab === 'quick-input' && '📝 Параметры бизнеса'}
                    {currentTab === 'csv-upload' && '📁 Загрузка базы клиентов'}
                    {currentTab === 'playbooks' && '📚 Выбор плейбука'}
                    {currentTab === 'value-prop' && '🎯 Тест оффера'}
                  </h2>

                  {currentTab === 'quick-input' && <QuickInputForm />}
                  {currentTab === 'csv-upload' && (
                    <>
                      <CSVUploader />
                      <AnomalyTable />
                    </>
                  )}
                  {currentTab === 'playbooks' && <PlaybookSelector />}
                  {currentTab === 'value-prop' && <ValuePropTester />}
                </div>
              </section>

              <section className="space-y-6 lg:sticky lg:top-28">
                <RevenueChart />

                {/* Виджет инфляции (появляется если введены данные) */}
                {quickInputData && (
                  <div className="bg-white p-6 rounded-3xl border-2 border-amber-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>🛡️</span> Inflation Guard
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {suggestPriceAdjustment(quickInputData.currentPrice, quickInputData.lastUpdateDate).reasoning}
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl rotate-12">📈</div>
                  <h3 className="text-xl font-black mb-3 flex items-center gap-2">
                    Аналитическая справка
                  </h3>
                  <p className="text-blue-50 leading-relaxed font-medium">
                    {currentTab === 'playbooks'
                      ? 'Плейбуки разработаны на основе методологий McKinsey и Bain для оптимизации структуры доходов в разных бизнес-моделях.'
                      : 'Система находит клиентов, которые платят ниже рыночной цены. Мы рассчитываем упущенную выгоду при индексации до нормы.'
                    }
                  </p>
                </div>
              </section>
            </div>

            {/* Секция экспорта (появляется когда есть данные для отчета) */}
            {reportData && (
              <section className="pt-12 border-t border-gray-200">
                <ExportSection reportData={reportData} isPremium={false} />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
