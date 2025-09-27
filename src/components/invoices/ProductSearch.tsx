import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiLoader } from "react-icons/fi";
import { formatCurrency } from "@/lib/utils";
import { ProductSearchResponse } from "./types";

interface ProductSearchProps {
  productSearchTerm: string;
  setProductSearchTerm: (term: string) => void;
  isSearchingProduct: boolean;
  searchedProducts: ProductSearchResponse["product"];
  selectProductAndShowPrices: (product: ProductSearchResponse["product"][0]) => void;
}

export default function ProductSearch({
  productSearchTerm,
  setProductSearchTerm,
  isSearchingProduct,
  searchedProducts,
  selectProductAndShowPrices,
}: ProductSearchProps) {
  const handleProductSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="mb-4 p-3 border rounded">
      <h4 className="text-sm font-medium mb-2">جستجوی محصول</h4>
      <div className="flex gap-2">
        <Input
          placeholder="جستجو با نام محصول یا کد عددی..."
          value={productSearchTerm}
          onChange={(e) => setProductSearchTerm(e.target.value)}
          onKeyDown={handleProductSearchKeyDown}
          className="flex-1"
        />
        {isSearchingProduct && (
          <div className="flex items-center px-2">
            <FiLoader className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        برای جستجو با کد محصول، فقط اعداد را وارد کنید
      </div>

      {searchedProducts.length > 0 && (
        <div className="mt-2 border rounded max-h-60 overflow-y-auto">
          {searchedProducts.map((product) => (
            <div
              key={product.ErpCode}
              className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">
                    {product.Name}
                    {product.Code && (
                      <span className="text-sm text-muted-foreground mr-2">
                        (کد: {product.Code})
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {product.MainGroupName} / {product.SideGroupName}
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {(product.SellPrice ?? 0) > 0 && (
                      <div className="text-xs">
                        قیمت اصلی: {formatCurrency(product.SellPrice ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice2 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۲: {formatCurrency(product.SellPrice2 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice3 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۳: {formatCurrency(product.SellPrice3 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice4 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۴: {formatCurrency(product.SellPrice4 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice5 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۵: {formatCurrency(product.SellPrice5 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice6 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۶: {formatCurrency(product.SellPrice6 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice7 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۷: {formatCurrency(product.SellPrice7 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice8 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۸: {formatCurrency(product.SellPrice8 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice9 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۹: {formatCurrency(product.SellPrice9 ?? 0)}
                      </div>
                    )}
                    {(product.SellPrice10 ?? 0) > 0 && (
                      <div className="text-xs">
                        فی ۱۰: {formatCurrency(product.SellPrice10 ?? 0)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    موجودی: {product.Few}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => selectProductAndShowPrices(product)}
                  disabled={!product.IsActive}
                >
                  افزودن
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 