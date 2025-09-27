import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UserCustomer } from "@/lib/api/customerService";
import React from "react";
import { FiPlus } from "react-icons/fi";
import CustomerSearch from "./CustomerSearch";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import ProductSearch from "./ProductSearch";
import { InvoiceFormData, InvoiceTotals, ProductSearchResponse } from "./types";

interface InvoiceFormProps {
  newInvoice: InvoiceFormData;
  setNewInvoice: React.Dispatch<React.SetStateAction<InvoiceFormData>>;
  customerSearchTerm: string;
  setCustomerSearchTerm: (term: string) => void;
  isSearchingCustomer: boolean;
  searchedCustomers: UserCustomer[];
  productSearchTerm: string;
  setProductSearchTerm: (term: string) => void;
  isSearchingProduct: boolean;
  searchedProducts: ProductSearchResponse["product"];
  isSaving: boolean;
  selectCustomer: (customer: UserCustomer) => void;
  selectProductAndShowPrices: (
    product: ProductSearchResponse["product"][0],
  ) => void;
  handlePriceTypeChange: (
    index: number,
    priceType: string,
    price: number,
  ) => void;
  handleDiscountChange: (index: number, discountPercent: string) => void;
  handleItemChange: (index: number, field: string, value: any) => void;
  removeItem: (index: number) => void;
  calculateInvoiceTotals: () => InvoiceTotals;
  createInvoice: () => void;
}

export default function InvoiceForm({
  newInvoice,
  setNewInvoice,
  customerSearchTerm,
  setCustomerSearchTerm,
  isSearchingCustomer,
  searchedCustomers,
  productSearchTerm,
  setProductSearchTerm,
  isSearchingProduct,
  searchedProducts,
  isSaving,
  selectCustomer,
  selectProductAndShowPrices,
  handlePriceTypeChange,
  handleDiscountChange,
  handleItemChange,
  removeItem,
  calculateInvoiceTotals,
  createInvoice,
}: InvoiceFormProps) {

  // Calculate total discount including both item-level and global discounts
  const calculateTotalDiscount = () => {
    // Calculate item-level discounts
    const itemDiscounts = newInvoice.items.reduce((acc, item) => {
      const price = item.unit_price * (item.is_usd_price ? 1 : item.quantity);
      const discountAmount = price * (parseFloat(item.discount_percent || "0") / 100);
      return acc + discountAmount;
    }, 0);

    // Calculate global discount
    const subtotal = newInvoice.items.reduce((acc, item) => {
      const total = item.unit_price * (item.is_usd_price ? 1 : item.quantity);
      const itemDiscount = total * (parseFloat(item.discount_percent || "0") / 100);
      return acc + (total - itemDiscount);
    }, 0);
    
    const globalDiscountAmount = subtotal * (parseFloat(newInvoice.discountPercent || "0") / 100);

    return itemDiscounts + globalDiscountAmount;
  };

  // Validate discount amount
  const validateDiscount = (discountPercent: string) => {
    const numericValue = parseFloat(discountPercent);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      return "0";
    }
    return discountPercent;
  };

  // Handle global discount change
  const handleGlobalDiscountChange = (value: string) => {
    const validatedDiscount = validateDiscount(value);
    const totalDiscount = calculateTotalDiscount();
    
    setNewInvoice({
      ...newInvoice,
      discountPercent: validatedDiscount,
      SumDiscount: totalDiscount
    });
  };

  // Update handleDiscountChange to recalculate total discount
  const handleLocalDiscountChange = (index: number, discountPercent: string) => {
    handleDiscountChange(index, discountPercent);
    
    // Update total discount after item discount changes
    const totalDiscount = calculateTotalDiscount();
    setNewInvoice(prev => ({
      ...prev,
      SumDiscount: totalDiscount
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4 sm:space-y-6">
          <CustomerSearch
            customerSearchTerm={customerSearchTerm}
            setCustomerSearchTerm={setCustomerSearchTerm}
            isSearchingCustomer={isSearchingCustomer}
            searchedCustomers={searchedCustomers}
            selectCustomer={selectCustomer}
            selectedCustomer={{
              customer_id: newInvoice.customer_id,
              customer_name: newInvoice.customer_name,
            }}
          />

          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <h3 className="text-lg font-medium">اقلام فاکتور</h3>
              <div className="flex items-center">
                <label className="text-sm font-medium mr-2">
                  درصد تخفیف کل:
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  className="w-20 inline-block"
                  value={newInvoice.discountPercent}
                  onChange={(e) => handleGlobalDiscountChange(e.target.value)}
                />
              </div>
            </div>

            <ProductSearch
              productSearchTerm={productSearchTerm}
              setProductSearchTerm={setProductSearchTerm}
              isSearchingProduct={isSearchingProduct}
              searchedProducts={searchedProducts}
              selectProductAndShowPrices={selectProductAndShowPrices}
            />

            <div className="space-y-4">
              {newInvoice.items.map((item, index) => (
                <InvoiceItem
                  key={item.id}
                  item={item}
                  index={index}
                  handleItemChange={handleItemChange}
                  handlePriceTypeChange={handlePriceTypeChange}
                  handleDiscountChange={handleLocalDiscountChange}
                  removeItem={removeItem}
                  isLastItem={newInvoice.items.length === 1}
                />
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setNewInvoice({
                    ...newInvoice,
                    items: [
                      ...newInvoice.items,
                      {
                        id: Math.random().toString(36).substring(2, 9),
                        product_id: "",
                        product_name: "",
                        product_erpcode: "",
                        warehouse_name: "",
                        quantity: 1,
                        unit_price: 0,
                        selected_price_type: "SellPrice",
                        discount_percent: "0",
                        total: 0,
                        available_prices: [],
                        is_usd_price: false,
                      },
                    ],
                  })
                }
              >
                <FiPlus className="mr-2 h-4 w-4" />
                افزودن آیتم
              </Button>
            </div>
          </div>

          <InvoiceSummary
            totals={{
              ...calculateInvoiceTotals(),
              totalDiscount: newInvoice.SumDiscount || 0
            }}
            isSaving={isSaving}
            createInvoice={createInvoice}
          />
        </div>
      </CardContent>
    </Card>
  );
}
