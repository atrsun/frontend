import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiTrash2 } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";
import { InvoiceItem as InvoiceItemType } from "./types";

interface InvoiceItemProps {
  item: InvoiceItemType;
  index: number;
  handleItemChange: (index: number, field: string, value: any) => void;
  handlePriceTypeChange: (index: number, priceType: string, price: number) => void;
  handleDiscountChange: (index: number, discountPercent: string) => void;
  removeItem: (index: number) => void;
  isLastItem: boolean;
}

export default function InvoiceItem({
  item,
  index,
  handleItemChange,
  handlePriceTypeChange,
  handleDiscountChange,
  removeItem,
  isLastItem,
}: InvoiceItemProps) {
  const formatPriceLabel = (price: number, type: string) => {
    const labels: Record<string, string> = {
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
    
    // Format currency based on price type
    const formattedPrice = type === "SellPrice4" 
      ? `${price} USD` 
      : formatCurrency(price);
      
    return `${labels[type] || type} - ${formattedPrice}`;
  };

  return (
    <div className="border rounded hover:bg-muted/30 transition-colors">
      {/* Mobile View */}
      <div className="block lg:hidden p-3 space-y-2">
        {/* Top Row - Product Info */}
        <div className="flex items-center gap-2">
          <div className="w-1/4">
            <Input
              value={item.warehouse_name}
              readOnly
              placeholder="انبار مرکزی"
              className="w-full bg-muted/50 text-center rounded-lg font-medium text-xs px-1"
            />
          </div>
          <div className="w-1/4">
            <Input
              value={item.product_id}
              readOnly
              placeholder="کد محصول"
              className="w-full bg-muted/50 text-center rounded-lg font-medium text-xs px-1"
            />
          </div>
          <div className="w-2/4">
            <Input
              value={item.product_name}
              readOnly
              placeholder="نام محصول"
              className="w-full bg-muted/50 text-center rounded-lg font-medium text-sm"
            />
          </div>
        </div>

        {/* Middle Row - Numbers */}
        <div className="flex items-center gap-2">
          <div className="w-1/4">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min="1"
              value={item.quantity}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
                handleItemChange(
                  index,
                  "quantity",
                  parseInt(numericValue || "0"),
                )
              }}
              className="text-center w-full text-sm px-1 ltr"
              placeholder="تعداد"
            />
          </div>
          <div className="w-2/4">
            <select
              value={`${item.selected_price_type}:${item.unit_price}`}
              onChange={(e) => {
                const [priceType, price] = e.target.value.split(":");
                handlePriceTypeChange(index, priceType, Number(price));
              }}
              className={`w-full h-9 px-2 rounded-lg text-sm ${
                item.is_usd_price
                  ? "border-blue-400 bg-blue-50/50"
                  : item.selected_price_type !== "SellPrice"
                  ? "border-orange-400 bg-orange-50/50"
                  : "border-input bg-background"
              } text-center`}
            >
              {item.available_prices && item.available_prices.length > 0 ? (
                item.available_prices.map(({ type, price }) => (
                  <option key={type} value={`${type}:${price}`}>
                    {formatPriceLabel(price, type)}
                  </option>
                ))
              ) : (
                <option value={`${item.selected_price_type}:${item.unit_price}`}>
                  {formatPriceLabel(item.unit_price, item.selected_price_type)}
                </option>
              )}
            </select>
          </div>
          <div className="w-1/4">
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              max="100"
              value={item.discount_percent}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
                handleDiscountChange(index, numericValue)
              }}
              className="text-center w-full text-sm px-1 ltr"
              placeholder="تخفیف"
            />
          </div>
        </div>

        {/* Bottom Row - Total and Delete */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {item.is_usd_price ? (
              <div className="p-1.5 bg-blue-50/50 text-blue-700 rounded-lg border border-blue-200 text-center font-medium text-sm">
                <div>{item.total} USD</div>
                {Number(item.discount_percent) > 0 && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {(item.unit_price * item.quantity * (Number(item.discount_percent) / 100)).toFixed(2)} USD تخفیف
                  </div>
                )}
              </div>
            ) : (
              <div className="p-1.5 bg-muted/50 rounded-lg text-center font-medium text-sm">
                <div>{formatCurrency(item.total)}</div>
                {Number(item.discount_percent) > 0 && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {formatCurrency(item.unit_price * item.quantity * (Number(item.discount_percent) / 100))} تخفیف
                  </div>
                )}
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => removeItem(index)}
            disabled={isLastItem}
            className="h-9 w-9 shrink-0 mr-1"
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:grid grid-cols-12 gap-2 items-center p-3">
        <div className="col-span-1">
          <Input
            value={item.warehouse_name}
            readOnly
            placeholder="انبار مرکزی"
            className="w-full bg-muted/50 text-center rounded-lg font-medium text-xs px-1"
          />
        </div>
        <div className="col-span-1">
          <Input
            value={item.product_id}
            readOnly
            placeholder="کد محصول"
            className="w-full bg-muted/50 text-center rounded-lg font-medium text-xs px-1"
          />
        </div>
        <div className="col-span-4">
          <Input
            value={item.product_name}
            readOnly
            placeholder="نام محصول"
            className="w-full bg-muted/50 text-center rounded-lg font-medium text-sm"
          />
        </div>
        <div className="col-span-1">
        <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
          min="1"
          value={item.quantity}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
            handleItemChange(
              index,
              "quantity",
                parseInt(numericValue || "0"),
            )
            }}
            className="text-center w-full text-sm px-1 ltr"
            placeholder="تعداد"
        />
      </div>
        <div className="col-span-2">
          <select
            value={`${item.selected_price_type}:${item.unit_price}`}
            onChange={(e) => {
              const [priceType, price] = e.target.value.split(":");
              handlePriceTypeChange(index, priceType, Number(price));
            }}
            className={`w-full h-9 px-2 rounded-lg text-sm ${
              item.is_usd_price
                ? "border-blue-400 bg-blue-50/50"
                : item.selected_price_type !== "SellPrice"
                ? "border-orange-400 bg-orange-50/50"
                : "border-input bg-background"
            } text-center`}
          >
            {item.available_prices && item.available_prices.length > 0 ? (
              item.available_prices.map(({ type, price }) => (
                <option key={type} value={`${type}:${price}`}>
                  {formatPriceLabel(price, type)}
                </option>
              ))
            ) : (
              <option value={`${item.selected_price_type}:${item.unit_price}`}>
                {formatPriceLabel(item.unit_price, item.selected_price_type)}
              </option>
            )}
          </select>
        </div>
        <div className="col-span-1">
        <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
          min="0"
          max="100"
          value={item.discount_percent}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
              handleDiscountChange(index, numericValue)
            }}
            className="text-center w-full text-sm px-1 ltr"
            placeholder="تخفیف"
        />
      </div>
        <div className="col-span-2 flex items-center justify-between">
          <div className="w-full">
            {item.is_usd_price ? (
              <div className="p-1.5 bg-blue-50/50 text-blue-700 rounded-lg border border-blue-200 text-center font-medium text-sm">
                <div>{item.total} USD</div>
                {Number(item.discount_percent) > 0 && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {(item.unit_price * item.quantity * (Number(item.discount_percent) / 100)).toFixed(2)} USD تخفیف
                  </div>
                )}
              </div>
            ) : (
              <div className="p-1.5 bg-muted/50 rounded-lg text-center font-medium text-sm">
                <div>{formatCurrency(item.total)}</div>
                {Number(item.discount_percent) > 0 && (
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {formatCurrency(item.unit_price * item.quantity * (Number(item.discount_percent) / 100))} تخفیف
                  </div>
                )}
              </div>
            )}
        </div>
        <Button
          variant="destructive"
            size="icon"
          onClick={() => removeItem(index)}
          disabled={isLastItem}
            className="h-9 w-9 shrink-0 mr-1"
        >
          <FiTrash2 className="h-4 w-4" />
        </Button>
        </div>
      </div>
    </div>
  );
} 