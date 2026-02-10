import React from 'react';

// Важно: экспорт должен быть и именованным, и по умолчанию для совместимости
export const PlaybookSelector: React.FC = () => {
   return (
      <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white text-center">
         <p className="text-gray-500 font-medium">Модуль выбора стратегий (Playbooks) активен</p>
      </div>
   );
};

export default PlaybookSelector;
