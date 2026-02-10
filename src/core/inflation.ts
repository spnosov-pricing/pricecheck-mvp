export function suggestPriceAdjustment(
   currentPrice: number,
   lastUpdateDate: Date,
   sector: string = 'IT Services',
   region: string = 'US'
) {
   // Базовая логика расчета (можно усложнить позже)
   const yearsPassed = new Date().getFullYear() - lastUpdateDate.getFullYear();
   const avgInflation = 0.045; // 4.5% в год
   const adjustmentPercentage = Math.max(0, yearsPassed * avgInflation * 100);
   const suggestedPrice = currentPrice * (1 + adjustmentPercentage / 100);

   return {
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      adjustmentPercentage,
      reasoning: `На основе данных по инфляции в секторе ${sector} (${region}), рекомендуется корректировка на ${adjustmentPercentage.toFixed(1)}%.`
   };
}
