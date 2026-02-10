// src/components/Playbooks/PlaybookSelector.tsx
import React from 'react';
import { useAppStore } from '../../store/appStore';
import { PRICING_PLAYBOOKS } from '../../core/playbooks';
import type { PricingPlaybook } from '../../core/types';

export const PlaybookSelector: React.FC = () => {
   const { selectedPlaybook, setSelectedPlaybook } = useAppStore();

   return (
      <div className="space-y-6">
         <div className="grid gap-4">
            {PRICING_PLAYBOOKS.map((playbook: PricingPlaybook) => (
               <div
                  key={playbook.id}
                  onClick={() => setSelectedPlaybook(playbook)}
                  className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${selectedPlaybook?.id === playbook.id
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                     }`}
               >
                  <h3 className="text-lg font-bold text-gray-900">
                     {playbook.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">{playbook.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                     {playbook.strategicTips.slice(0, 2).map((tip, idx) => (
                        <span
                           key={idx}
                           className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                           {tip.category}
                        </span>
                     ))}
                  </div>
               </div>
            ))}
         </div>

         {selectedPlaybook && (
            <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
               <h4 className="font-bold text-blue-900 mb-4">
                  Рекомендованные уровни цен:
               </h4>
               <div className="space-y-3">
                  {selectedPlaybook.recommendedTiers.map((tier, idx) => (
                     <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-white rounded-lg"
                     >
                        <div>
                           <p className="font-bold text-gray-900">{tier.name}</p>
                           <p className="text-xs text-gray-600">
                              {tier.targetCustomer}
                           </p>
                        </div>
                        <p className="font-bold text-blue-600">{tier.priceRange}</p>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default PlaybookSelector;
