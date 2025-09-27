import apiClient from "./config";

export interface HolooProduct {
  Code?: string;
  Name: string;
  Few: number;
  FewKarton?: number;
  FewSpd?: number;
  FewTak?: number;
  BuyPrice?: number;
  LastBuyPrice?: number;
  SellPrice: number;
  SellPrice2?: number;
  SellPrice3?: number;
  SellPrice4?: number;
  SellPrice5?: number;
  SellPrice6?: number;
  SellPrice7?: number;
  SellPrice8?: number;
  SellPrice9?: number;
  SellPrice10?: number;
  SelPriceKarton?: number;
  CountInKarton?: number;
  CountInBasteh?: number;
  MainGroupName: string;
  MainGroupErpCode?: string;
  SideGroupName: string;
  SideGroupErpCode?: string;
  UnitErpCode?: number;
  EtebarTakhfifAz?: string;
  EtebarTakhfifTa?: string;
  Other1?: string;
  Other2?: string;
  DiscountPercent?: number;
  DiscountPrice?: number;
  ErpCode: string;
  IsActive: boolean;
  modifyDate?: string;
  service?: boolean;
}

export interface ProductResponse {
  product: HolooProduct[] | HolooProduct;
}

export interface ProductSearchParams {
  name?: string;
  code?: string;
  erpcode?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface ProductInfo {
  product_variant_erpcode: string;
  productCode?: string;
  quantity: number;
  price: number;
  productName?: string;
  discount_percent?: string;
  Few?: number;
}

export interface CreatePreInvoiceDto {
  productInfo: ProductInfo[];
  costumerErpCode: string;
  discountPercent: string;
}

const productService = {
  /**
   * Get product by name, code, or erpcode
   * Note: at least one of these parameters should be provided
   */
  getProduct: async (params: ProductSearchParams) => {
    if (!params.name && !params.code && !params.erpcode) {
      throw new Error(
        "At least one search parameter (name, code, or erpcode) must be provided",
      );
    }

    const response = await apiClient.get<ProductResponse>("/holoo/product", {
      params: {
        name: params.name,
        code: params.code,
        erpcode: params.erpcode,
      },
    });
    return response.data;
  },

  /**
   * Get list of products with pagination
   * Default is page 1 and limit 10
   */
  getProducts: async (params: ProductListParams = {}) => {
    const url = `${
      process.env.NEXT_PUBLIC_API_URL || "https://holoo.evasence.ir"
        // process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    }/holoo/products?limit=${params.limit || 10}&page=${params.page || 1}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const data = (await response.json()) as ProductResponse;
    return data;
  },

  /**
   * Create a pre-invoice
   */
  createPreInvoice: async (data: CreatePreInvoiceDto) => {
    console.log("=== Pre-Invoice Creation Debug Logs ===");
    console.log("1. Original Input Data:", JSON.stringify(data, null, 2));
    
    // Calculate total discount amount
    const calculateItemDiscount = (item: ProductInfo) => {
      const itemTotal = item.quantity * item.price;
      return itemTotal * (parseFloat(item.discount_percent || "0") / 100);
    };

    const itemDiscounts = data.productInfo.reduce((sum, item) => sum + calculateItemDiscount(item), 0);
    const subtotal = data.productInfo.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const remainingAfterItemDiscounts = subtotal - itemDiscounts;
    const globalDiscountAmount = remainingAfterItemDiscounts * (parseFloat(data.discountPercent || "0") / 100);
    const totalDiscount = itemDiscounts + globalDiscountAmount;
    
    // Format and validate the data
    const payload = {
      costumerErpCode: data.costumerErpCode,
      discountPercent: String(data.discountPercent || "0"),
      SumDiscount: Math.round(totalDiscount),
      productInfo: data.productInfo.map(item => {
        // Ensure discount_percent is a valid number between 0-100
        const discountPercent = Math.min(100, Math.max(0, parseFloat(item.discount_percent || "0")));
        
        return {
          product_variant_erpcode: item.product_variant_erpcode,
          productCode: item.productCode,
          quantity: Number(item.quantity),
          price: Number(item.price), // Send original price without any modifications
          productName: item.productName,
          discount_percent: String(discountPercent), // Send item-level discount
          Few: item.Few || item.quantity
        };
      })
    };

    console.log("3. Final API Payload:", JSON.stringify(payload, null, 2));
    console.log("4. Discount Calculations:", {
      subtotal,
      itemDiscounts,
      remainingAfterItemDiscounts,
      globalDiscountAmount,
      totalDiscount,
      details: data.productInfo.map(item => ({
        productName: item.productName,
        originalPrice: item.price,
        itemDiscount: calculateItemDiscount(item),
        priceAfterItemDiscount: item.price - (calculateItemDiscount(item) / item.quantity)
      }))
    });
    
    try {
      const response = await apiClient.post("/pre-invoice/preInvoice", payload);
      console.log("5. API Response:", JSON.stringify(response.data, null, 2));
    return response.data;
    } catch (error: any) {
      console.error("6. API Error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  },
};

export default productService;
