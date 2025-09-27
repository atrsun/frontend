//import puppeteer from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';

// function toPersianNumbers(input: string | number): string {
//   const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
//   return input.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
// }

// // تاریخ شمسی عددی (مثلاً ۱۴۰۳/۰۲/۱۲)
// function formatPersianDateTime(dateString?: string) {
//   let date: Date;
//   try {
//     if (dateString) {
//       if (dateString.includes('T')) {
//         date = new Date(dateString);
//       } else if (dateString.includes('/')) {
//         const [year, month, day] = dateString.split('/').map(num => parseInt(num));
//         date = new Date(year, month - 1, day);
//       } else {
//         date = new Date();
//       }
//     } else {
//       date = new Date();
//     }
//     if (isNaN(date.getTime())) {
//       date = new Date();
//     }
//   } catch {
//     date = new Date();
//   }

//   // ماه عددی دو رقمی
//   const persianDate = new Intl.DateTimeFormat('fa-IR', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   }).format(date);

//   const time = date.toLocaleTimeString('fa-IR', {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   return { date: persianDate, time };
// }

// function calculateDiscounts(details: any[]) {
//   return details.reduce((acc, item) => {
//     const discountPercent = item.discount_percent ?? item.Discount ?? 0;
//     const price = (item.unit_price ?? 0) * (item.quantity ?? 1);
//     const discountAmount = (price * discountPercent) / 100;
//     return acc + discountAmount;
//   }, 0);
// }

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
     console.log(data); 
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.setCacheEnabled(false);

    // const htmlContent = generateInvoiceHTML(data);

    // await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // const pdfBuffer = await page.pdf({
    //   format: 'A4',
    //   printBackground: true,
    //   margin: {
    //     top: '1cm',
    //     right: '1cm',
    //     bottom: '1cm',
    //     left: '1cm'
    //   }
    // });

    // await browser.close();

    // return new NextResponse(Buffer.from(pdfBuffer), {
    //   status: 200,
    //   headers: {
    //     'Content-Type': 'application/pdf',
    //     'Content-Disposition': `attachment; filename="invoice-p-${data.id}.pdf"`,
    //     'Cache-Control': 'no-store, max-age=0'
    //   },
    // });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

// function generateInvoiceHTML(data: any): string {
//   const formatNumber = (num: number) => {
//     return toPersianNumbers(new Intl.NumberFormat('fa-IR').format(num));
//   };

//   const { date: persianDate, time } = formatPersianDateTime(data.date);

//   const totalDiscounts = calculateDiscounts(data.details);

//   const detailRows = data.details.map((item: any, index: number) => {
//     const discountPercent = item.discount_percent ?? item.Discount ?? 0;
   
//     const price = (item.unit_price ?? 0) * (item.quantity ?? 1);
//     const discountAmount = (price * discountPercent) / 100;
   
//     const total = (item.SumPrice ?? price) - discountAmount;
    

//     return `
//     <tr>
//       <td style="text-align: center;">${toPersianNumbers(index + 1)}</td>
//       <td style="text-align: right;">${toPersianNumbers(item.ProductErpCode || item.product_id || "")}</td>
//       <td style="text-align: right;">${item.product_name}</td>
//       <td style="text-align: center;">${toPersianNumbers(item.quantity ?? 1)}</td>
//       <td style="text-align: left;">${formatNumber(item.unit_price ?? 0)}</td>
//       <td style="text-align: center;">${toPersianNumbers(discountPercent)}</td>
//       <td style="text-align: left;">${formatNumber(Math.round(total))}</td>
//     </tr>
//   `;
//   }).join('');

//   return `
//     <!DOCTYPE html>
//     <html dir="rtl" lang="fa">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>پیش فاکتور ${toPersianNumbers(data.id)}</title>
//       <style>
//         @font-face {
//           font-family: 'Vazirmatn';
//           src: url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2') format('woff2');
//           font-weight: normal;
//           font-style: normal;
//         }
//         body {
//           font-family: 'Vazirmatn', Tahoma, Arial, sans-serif;
//           margin: 0;
//           padding: 20px;
//           color: #333;
//           direction: rtl;
//           font-size: 12px;
//         }
//         .invoice-container {
//           width: 100%;
//           max-width: 21cm;
//           margin: 0 auto;
//         }
//         .invoice-header {
//           display: grid;
//           grid-template-columns: 1fr auto 1fr;
//           gap: 20px;
//           margin-bottom: 20px;
//           border-bottom: 2px solid #000;
//           padding-bottom: 10px;
//         }
//         .invoice-title {
//           font-size: 24px;
//           font-weight: bold;
//           text-align: center;
//         }
//         .invoice-number {
//           font-size: 14px;
//           color: #666;
//         }
//         .header-section {
//           display: grid;
//           grid-template-columns: auto 1fr;
//           gap: 10px;
//         }
//         .header-label {
//           font-weight: bold;
//         }
//         table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-bottom: 20px;
//         }
//         th, td {
//           border: 1px solid #000;
//           padding: 8px;
//           font-size: 12px;
//         }
//         th {
//           background-color: #f5f5f5;
//           font-weight: bold;
//         }
//         .totals-section {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 20px;
//           border-top: 2px solid #000;
//           padding-top: 10px;
//         }
//         .total-amount {
//           font-weight: bold;
//           font-size: 14px;
//         }
//         .footer {
//           margin-top: 40px;
//           text-align: center;
//           font-size: 14px;
//           font-weight: bold;
//         }
//         .signatures {
//           display: flex;
//           justify-content: space-between;
//           margin-top: 60px;
//         }
//         .signature-box {
//           width: 200px;
//           text-align: center;
//         }
//         .signature-line {
//           border-top: 1px solid #000;
//           margin-top: 20px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="invoice-container">
//         <div class="invoice-header">
//           <div class="header-section">
//             <div class="header-label">شماره:</div>
//             <div>${toPersianNumbers(data.id)}</div>
//             <div class="header-label">تاریخ و ساعت:</div>
//             <div>${time} - ${persianDate}</div>
//           </div>
//           <div class="invoice-title">
//             پیش فاکتور
//           </div>
//           <div class="header-section" style="text-align: left;">
//             <div class="header-label">مهلت تسویه:</div>
//             <div>${data.payment_due ? toPersianNumbers(data.payment_due) : '---'}</div>
//           </div>
//         </div>
       
//         <table>
//           <thead>
//             <tr>
//               <th style="width: 5%;">ردیف</th>
//               <th style="width: 10%;">کد کالا</th>
//               <th style="width: 35%;">نام کالا</th>
//               <th style="width: 10%;">تعداد</th>
//               <th style="width: 15%;">بهای واحد</th>
//               <th style="width: 10%;">درصد تخفیف</th>
//               <th style="width: 15%;">مبلغ کل</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${detailRows}
//           </tbody>
//         </table>

//         <div class="totals-section">
//           <div>
//             <div>جمع کل تعداد: ${toPersianNumbers(data.details.reduce((sum: number, item: any) => sum + (item.quantity ?? 1), 0))}</div>
//             <div>جمع کل تخفیف:  ${formatNumber(Math.round(totalDiscounts))} ریال</div>
//           </div>
//           <div class="total-amount">
//             مبلغ پیش فاکتور: ${formatNumber(Math.round(data.totals?.rialTotal ?? 0))} ریال
//           </div>
//         </div>

//         <div class="footer">
//           اعتبار تا ${toPersianNumbers(2)} روز میباشد
//         </div>

//         <div class="signatures">
//           <div class="signature-box">
//           <div>${data.sellerInfo?.name}</div>
//             <div class="signature-line"></div>
//             <div>مهر و امضاء فروشنده</div>
//           </div>
//           <div class="signature-box">
//           <div>${data.customer_name}</div>
//             <div class="signature-line"></div>
//             <div>مهر و امضاء خریدار</div>
//           </div>
//         </div>

//         <div style="font-size: 10px; margin-top: 20px; text-align: center;">
//           با دریافت این کالا متعهد به تسویه تا ${toPersianNumbers(3)} ماه از تاریخ فاکتور میباشید در غیر اینصورت تسویه بر اساس قیمت روز صورت میگیرد
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
// }