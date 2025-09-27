export interface InvoiceItem {
  id: string;
  product_id: string;
  product_erpcode: string;
  product_name: string;
  warehouse_name: string;
  quantity: number;
  unit_price: number;
  selected_price_type: string;
  discount_percent: string;
  total: number;
  available_prices: Array<{ type: string; price: number }>;
  is_usd_price: boolean;
}

export interface ProductSearchResponse {
  product: Array<{
    Name: string;
    Code?: string;
    SellPrice: number;
    SellPrice1?: number;
    SellPrice2?: number;
    SellPrice3?: number;
    SellPrice4?: number;
    SellPrice5?: number;
    SellPrice6?: number;
    SellPrice7?: number;
    SellPrice8?: number;
    SellPrice9?: number;
    SellPrice10?: number;
    ErpCode: string;
    MainGroupName: string;
    SideGroupName: string;
    Few: number;
    IsActive: boolean;
    [key: string]: any;
  }>;
}

export interface InvoiceFormData {
  customer_id: string;
  customer_name: string;
  items: InvoiceItem[];
  discountPercent: string;
  SumDiscount?: number;
}

export interface InvoiceTotals {
  rialSubtotal: number;
  usdSubtotal: number;
  rialTotal: number;
  usdTotal: number;
} 