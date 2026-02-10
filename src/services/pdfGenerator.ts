import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Импортируем без переменной, если используете через pdf.autoTable()
import type { ReportData } from '../core/types';

export async function generatePricingReport(data: ReportData) {
   const pdf = new jsPDF() as any; // Используем any для доступа к методу autoTable

   // Ваш код генерации...
   pdf.autoTable({
      head: [['Параметр', 'Значение']],
      body: [['Бренд', data.brandName]],
   });

   pdf.save('report.pdf');
}
