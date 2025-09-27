interface InvoiceDetail {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  is_usd_price: boolean;
  discount_percent: string;
  total: number;
}

interface InvoiceTotals {
  rialSubtotal: number;
  usdSubtotal: number;
  rialTotal: number;
  usdTotal: number;
}

interface SellerInfo {
  name: string;
  phone: string;
  address: string;
}

interface InvoiceData {
  id: string;
  date: string;
  customer_name: string;
  customer_id: string;
  details: InvoiceDetail[];
  totals: InvoiceTotals;
  sellerInfo: SellerInfo;
}

export async function downloadInvoicePDF(invoiceData: InvoiceData): Promise<void> {
  try {
    // Call the API endpoint with the invoice data
    const response = await fetch(`/api/generate-pdf?nocache=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Get the PDF blob from the response
    const pdfBlob = await response.blob();
    
    // Create a download link and trigger download
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceData.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
} 