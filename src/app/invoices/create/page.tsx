"use client";

import InvoiceForm from "@/components/invoices/InvoiceForm";
import {
  InvoiceFormData,
  InvoiceItem,
  ProductSearchResponse,
} from "@/components/invoices/types";
import { Button } from "@/components/ui/button";
import { customerService, productService } from "@/lib/api";
import { CustomerFilterParams, UserCustomer } from "@/lib/api/customerService";
import { CreatePreInvoiceDto } from "@/lib/api/productService";
import { generateId } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Toaster, toast } from "sonner";

// Add localStorage keys
const STORAGE_KEY = "invoiceFormData";

// Add debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [searchedCustomers, setSearchedCustomers] = useState<UserCustomer[]>([]);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState<
    ProductSearchResponse["product"]
  >([]);
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Default invoice state
  const defaultInvoiceState: InvoiceFormData = {
    customer_id: "",
    customer_name: "",
    items: [], // Start with no items
    discountPercent: "0",
  };

  // State for new invoice
  const [newInvoice, setNewInvoice] =
    useState<InvoiceFormData>(defaultInvoiceState);

  // Load saved form data from localStorage on initial render
  useEffect(() => {
    const savedFormData = localStorage.getItem(STORAGE_KEY);
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setNewInvoice(parsedData);

        // Show toast to notify user about restored data
        toast.info("اطلاعات قبلی فرم بازیابی شد", {
          duration: 3000,
        });
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Only save if there's meaningful data (customer selected or items with products)
    const hasCustomer = !!newInvoice.customer_id;
    const hasProducts = newInvoice.items.some((item) => !!item.product_erpcode);

    if (hasCustomer || hasProducts) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newInvoice));
    }
  }, [newInvoice]);

  // Add debounce hook
  const debouncedCustomerSearch = useDebounce(customerSearchTerm, 500);
  const debouncedProductSearch = useDebounce(productSearchTerm, 500);

  // Modify customer search to be automatic
  useEffect(() => {
    if (debouncedCustomerSearch) {
      (async () => {
        setIsSearchingCustomer(true);
        setSearchedCustomers([]);

        try {
          const searchParams: CustomerFilterParams = {
            name: debouncedCustomerSearch.trim(),
          };
          
          const customers = await customerService.filterCustomersByName(searchParams);
          console.log('Customer search results:', customers);
          
          setSearchedCustomers(customers);
          
          if (customers.length === 0) {
            toast.error("مشتری با این مشخصات یافت نشد");
          }
        } catch (error) {
          console.error("Error searching customer:", error);
          setSearchedCustomers([]);
          toast.error("خطا در جستجوی مشتری");
        } finally {
          setIsSearchingCustomer(false);
        }
      })();
    } else {
      setSearchedCustomers([]);
    }
  }, [debouncedCustomerSearch]);

  // Modify product search to be automatic
  useEffect(() => {
    if (debouncedProductSearch) {
      (async () => {
        setIsSearchingProduct(true);
        setSearchedProducts([]);

        try {
          let searchTerm = debouncedProductSearch.trim();
          // Convert Persian digits to English
          searchTerm = searchTerm.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
          const isNumeric = /^\d+$/.test(searchTerm);

          const response = await productService.getProduct({
            name: isNumeric ? undefined : searchTerm,
            code: isNumeric ? searchTerm : undefined,
          });

          if (response && response.product) {
            let products: any[] = [];
            if (Array.isArray(response.product)) {
              products = response.product;
            } else {
              products = [response.product];
            }
            // اگر جستجو بر اساس کد بود، فقط محصولاتی که کدشان با مقدار جستجو شروع می‌شود را نگه دار
            if (isNumeric && searchTerm) {
              products = products.filter(p => (p.Code || "").toString().startsWith(searchTerm));
            }
            const formattedProducts = products.map((p) => ({
                Name: p.Name || "Unknown",
              Code: p.Code || "",
                SellPrice: p.SellPrice || 0,
                SellPrice2: p.SellPrice2 || 0,
                SellPrice3: p.SellPrice3 || 0,
                SellPrice4: p.SellPrice4 || 0,
                SellPrice5: p.SellPrice5 || 0,
                SellPrice6: p.SellPrice6 || 0,
                SellPrice7: p.SellPrice7 || 0,
                SellPrice8: p.SellPrice8 || 0,
                SellPrice9: p.SellPrice9 || 0,
                SellPrice10: p.SellPrice10 || 0,
                ErpCode: p.ErpCode || "",
                MainGroupName: p.MainGroupName || "",
                SideGroupName: p.SideGroupName || "",
                Few: p.Few || 0,
                IsActive: p.IsActive || false,
              }));
              setSearchedProducts(formattedProducts);

              if (formattedProducts.length === 0) {
                toast.error("محصولی با این مشخصات یافت نشد");
            }
          } else {
            setSearchedProducts([]);
            toast.error("محصولی با این مشخصات یافت نشد");
          }
        } catch (error) {
          console.error("Error searching product:", error);
          setSearchedProducts([]);
          toast.error("خطا در جستجوی محصول");
        } finally {
          setIsSearchingProduct(false);
        }
      })();
    } else {
      setSearchedProducts([]);
    }
  }, [debouncedProductSearch]);

  // Modify selectCustomer to use UserCustomer
  const selectCustomer = (customer: UserCustomer) => {
    console.log("Selecting customer in page component:", customer);
    console.log('Selected customer ErpCode:', customer.ErpCode);
    
    if (!customer || !customer.ErpCode) {
      console.error("Invalid customer data:", customer);
      toast.error("داده‌های مشتری نامعتبر است");
      return;
    }
    
    setNewInvoice({
      ...newInvoice,
      customer_id: customer.ErpCode,
      customer_name: customer.Name || "مشتری بدون نام",
    });
    
    setSearchedCustomers([]);
    setCustomerSearchTerm("");

    toast.success(`مشتری "${customer.Name || "بدون نام"}" انتخاب شد`, {
      duration: 2000,
    });
  };

  // Update handlePriceTypeChange to handle price selection
  const handlePriceTypeChange = (
    index: number,
    priceType: string,
    price: number,
  ) => {
    const updatedItems = [...newInvoice.items];
    const item = { ...updatedItems[index] };

    item.selected_price_type = priceType;
    item.unit_price = price;
    // Only set USD flag for SellPrice4
    item.is_usd_price = priceType === "SellPrice4";
    item.total = calculateItemTotal(item);

    updatedItems[index] = item;
    setNewInvoice({ ...newInvoice, items: updatedItems });

    // More descriptive toast message showing what price type was selected
    const priceLabels: Record<string, string> = {
      SellPrice: "قیمت اصلی",
      SellPrice2: "فی ۲",
      SellPrice3: "فی ۳",
      SellPrice4: "فی ۴ (USD)",
      SellPrice5: "فی ۵",
      SellPrice6: "فی ۶",
      SellPrice7: "فی ۷",
      SellPrice8: "فی ۸",
      SellPrice9: "فی ۹",
      SellPrice10: "فی ۱۰",
    };

    toast.success(
      `قیمت "${priceLabels[priceType] || priceType}" برای محصول "${
        item.product_name
      }" انتخاب شد`,
    );
  };

  // Add discount handler
  const handleDiscountChange = (index: number, discountPercent: string) => {
    const updatedItems = [...newInvoice.items];
    const item = { ...updatedItems[index] };

    item.discount_percent = discountPercent;
    item.total = calculateItemTotal(item);

    updatedItems[index] = item;
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  // Calculate item total with discount
  const calculateItemTotal = (item: InvoiceItem) => {
    const price = item.unit_price;
    const total = item.quantity * price; // Always use item.quantity
    const discountAmount = total * (parseFloat(item.discount_percent || "0") / 100);
    return total - discountAmount;
  };

  // Update handleItemChange to use new total calculation
  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...newInvoice.items];
    const item = { ...updatedItems[index], [field]: value };

    if (field === "quantity" || field === "unit_price") {
      item.total = calculateItemTotal(item);
    }

    updatedItems[index] = item;
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  // Select a product and all its prices
  const selectProductAndShowPrices = (
    product: ProductSearchResponse["product"][0],
  ) => {
    console.log('Selected product:', product);
    console.log('Selected product ErpCode:', product.ErpCode);
    // Get all available prices
    const availablePrices = getProductPrices(product.ErpCode) || [];

    // Add the product with all its available prices
    addProductToInvoice(product);

    // Show a toast informing about multiple prices if available
    if (availablePrices.length > 1) {
      toast.info(
        "این محصول دارای چند قیمت است. می‌توانید از لیست قیمت‌ها انتخاب کنید.",
        {
          duration: 4000,
        },
      );
    }
  };

  // Update addProductToInvoice function to not set USD price automatically
  const addProductToInvoice = (
    product: ProductSearchResponse["product"][0],
  ) => {
    console.log('Selected product:', product);
    console.log('Selected product ErpCode:', product.ErpCode);
    // Get all available prices for this product
    const availablePrices = getProductPrices(product.ErpCode) || [];

    // Store both product_id (Code) for display and product_erpcode (ErpCode) for API
    const newItem: InvoiceItem = {
      id: generateId("item"),
      product_id: product.Code || "",         // Numeric code for display
      product_erpcode: product.ErpCode || "", // ErpCode for API
      product_name: product.Name,
      warehouse_name: product.MainGroupName || "انبار مرکزی",
      quantity: 1,
      unit_price: product.SellPrice,
      selected_price_type: "SellPrice",
      discount_percent: "0",
      total: product.SellPrice,
      available_prices: availablePrices,
      is_usd_price: false, // Default to false, will be set only when SellPrice4 is selected
    };

    setNewInvoice({
      ...newInvoice,
      items: [newItem, ...newInvoice.items],
    });

    // Clear search results and input
    setSearchedProducts([]);
    setProductSearchTerm("");

    toast.success(`محصول "${product.Code || 'بدون کد'}" به لیست اضافه شد`, {
      duration: 2000,
    });
  };

  // Remove item
  const removeItem = (index: number) => {
    const itemToRemove = newInvoice.items[index];
    const updatedItems = [...newInvoice.items];
    updatedItems.splice(index, 1);
    setNewInvoice({ ...newInvoice, items: updatedItems });

    toast.success(`محصول "${itemToRemove.product_name}" از لیست حذف شد`, {
      duration: 2000,
    });
  };

  // Calculate invoice totals with separate USD and IRR calculations
  const calculateInvoiceTotals = () => {
    // Separate items by currency type
    const rialItems = newInvoice.items.filter((item) => !item.is_usd_price);
    const usdItems = newInvoice.items.filter((item) => item.is_usd_price);

    // Calculate subtotals for each currency
    const rialSubtotal = rialItems.reduce((sum, item) => sum + item.total, 0);
    const usdSubtotal = usdItems.reduce((sum, item) => sum + item.total, 0);

    return {
      rialSubtotal,
      usdSubtotal,
      rialTotal: rialSubtotal,
      usdTotal: usdSubtotal,
    };
  };

  // Create invoice
  const createInvoice = async () => {
    // Validate required fields before sending
    if (!newInvoice.customer_id) {
      toast.error("لطفاً مشتری را انتخاب کنید");
      return;
    }

    if (newInvoice.items.length === 0) {
      toast.error("لطفاً حداقل یک محصول به فاکتور اضافه کنید");
      return;
    }

    // Filter out invalid products
    const validItems = newInvoice.items.filter(
      (item) =>
        item.product_erpcode &&
        item.product_id &&
        item.product_name &&
        item.quantity > 0 &&
        item.unit_price > 0
    );

    if (validItems.length === 0) {
      toast.error("تمام محصولات باید کد، نام، تعداد و قیمت داشته باشند");
      return;
    }

    // Prepare payload exactly as Holoo API expects
    const preInvoiceData: CreatePreInvoiceDto = {
      costumerErpCode: newInvoice.customer_id,
      discountPercent: String(newInvoice.discountPercent || "0"),
      productInfo: validItems.map((item) => {
        // Convert discount percent to string and ensure it's a valid number
        const discountPercent = item.discount_percent ? 
          String(Math.max(0, Math.min(100, Number(item.discount_percent)))) : 
          "0";

        return {
          product_variant_erpcode: item.product_erpcode,
          productCode: item.product_id,
          quantity: item.quantity,
          price: item.unit_price,
          productName: item.product_name,
          discount_percent: discountPercent,
          Discount: discountPercent,
          Few: item.quantity // Always use quantity for Few
        };
      })
    };

    // Debug logs
    console.log("=== Creating Pre-Invoice ===");
    console.log("1. Form Data:", {
      customer: newInvoice.customer_id,
      globalDiscount: newInvoice.discountPercent,
      itemCount: validItems.length
    });
    
    console.log("2. Items Detail:", validItems.map(item => ({
      name: item.product_name,
      price: item.unit_price,
      quantity: item.quantity,
      discount: item.discount_percent,
      isUSD: item.is_usd_price
    })));

    setIsSaving(true);

    try {
      const result = await productService.createPreInvoice(preInvoiceData);
      console.log("3. API Success:", result);

      toast.success("پیش‌فاکتور با موفقیت ایجاد شد");
      // Wait a moment so the user sees the message
      setTimeout(() => {
        // Clear form data from localStorage on successful submission
        localStorage.removeItem(STORAGE_KEY);
        // Navigate back to the invoices list page
        router.push("/invoices");
      }, 1200);
    } catch (error: any) {
      console.error("3. API Error:", error);
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "خطا در ایجاد پیش‌فاکتور";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Update the helper function to get product prices
  const getProductPrices = (productId: string) => {
    const product = searchedProducts.find((p) => p.ErpCode === productId);
    if (!product) return null;

    // Create an array of all possible price fields
    const prices = [
      { type: "SellPrice", price: product.SellPrice || 0 },
      { type: "SellPrice2", price: product.SellPrice2 || 0 },
      { type: "SellPrice3", price: product.SellPrice3 || 0 },
      { type: "SellPrice4", price: product.SellPrice4 || 0 },
      { type: "SellPrice5", price: product.SellPrice5 || 0 },
      { type: "SellPrice6", price: product.SellPrice6 || 0 },
      { type: "SellPrice7", price: product.SellPrice7 || 0 },
      { type: "SellPrice8", price: product.SellPrice8 || 0 },
      { type: "SellPrice9", price: product.SellPrice9 || 0 },
      { type: "SellPrice10", price: product.SellPrice10 || 0 },
    ];

    // Only return prices that are greater than 0
    return prices.filter((item) => item.price > 0);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Toaster position="top-center" expand={true} richColors />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            ایجاد پیش فاکتور جدید
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            لطفاً اطلاعات پیش فاکتور را وارد کنید
          </p>
        </div>
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-initial" 
          onClick={() => router.push("/invoices")}
        >
          <FiArrowRight className="mr-2 h-4 w-4" />
          بازگشت به لیست
        </Button>
      </div>

      <InvoiceForm
        newInvoice={newInvoice}
        setNewInvoice={setNewInvoice}
        customerSearchTerm={customerSearchTerm}
        setCustomerSearchTerm={setCustomerSearchTerm}
        isSearchingCustomer={isSearchingCustomer}
        searchedCustomers={searchedCustomers}
        productSearchTerm={productSearchTerm}
        setProductSearchTerm={setProductSearchTerm}
        isSearchingProduct={isSearchingProduct}
        searchedProducts={searchedProducts}
        isSaving={isSaving}
        selectCustomer={selectCustomer}
        selectProductAndShowPrices={selectProductAndShowPrices}
        handlePriceTypeChange={handlePriceTypeChange}
        handleDiscountChange={handleDiscountChange}
        handleItemChange={handleItemChange}
        removeItem={removeItem}
        calculateInvoiceTotals={calculateInvoiceTotals}
        createInvoice={createInvoice}
      />
    </div>
  );
} 