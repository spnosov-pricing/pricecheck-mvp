import { QuickInputForm } from './components/Forms/QuickInputForm';
import { RevenueChart } from './components/Results/RevenueChart';
import { useAppStore } from './store/appStore';

function App() {
  const { currentTab, setCurrentTab } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Навигация / Шапка */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">PriceCheck MVP</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentTab('quick-input')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentTab === 'quick-input' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Симулятор
            </button>
            <button
              onClick={() => setCurrentTab('csv-upload')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${currentTab === 'csv-upload' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Leakage Finder
            </button>
          </nav>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Левая колонка: Ввод данных */}
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Входные данные</h2>
              {currentTab === 'quick-input' ? (
                <QuickInputForm />
              ) : (
                <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
                  Модуль загрузки CSV в разработке
                </div>
              )}
            </div>
          </section>

          {/* Правая колонка: Результаты */}
          <section className="space-y-6">
            <RevenueChart />

            {/* Дополнительная карточка с подсказкой */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-lg text-white shadow-lg">
              <h3 className="text-lg font-bold mb-2">Как это работает?</h3>
              <p className="text-blue-100 text-sm">
                Мы используем модели эластичности спроса, специфичные для вашей отрасли,
                чтобы предсказать потенциальный отток клиентов при изменении цены.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;
