// src/components/Common/Loader.tsx
import React from 'react';

interface LoaderProps {
   size?: 'sm' | 'md' | 'lg';
   label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', label }) => {
   // Настройка размеров крутилки
   const sizeClasses = {
      sm: 'h-4 w-4 border-2',
      md: 'h-8 w-8 border-3',
      lg: 'h-12 w-12 border-4',
   };

   return (
      <div className="flex flex-col items-center justify-center space-y-3">
         <div
            className={`
          ${sizeClasses[size]} 
          animate-spin 
          rounded-full 
          border-blue-100 
          border-t-blue-600
        `}
         />
         {label && <p className="text-sm text-gray-500 font-medium">{label}</p>}
      </div>
   );
};
