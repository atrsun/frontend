"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiFileText, FiUsers, FiPackage } from "react-icons/fi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { productService } from "@/lib/api";
import { HolooProduct } from "@/lib/api/productService";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [products, setProducts] = useState<HolooProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Function to fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch products
      const productsResponse = await productService.getProducts({ limit: 5 });
      
      if (productsResponse && productsResponse.product) {
        let productsList: HolooProduct[] = [];
        
        if (Array.isArray(productsResponse.product)) {
          productsList = productsResponse.product;
        } else {
          productsList = [productsResponse.product];
        }
        
        setProducts(productsList);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("خطا در دریافت لیست محصولات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">داشبورد</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          خلاصه وضعیت کسب و کار شما
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">آخرین محصولات</CardTitle>
            <CardDescription>
              5 محصول اخیر در سیستم
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <div className="text-center py-4 text-destructive">{error}</div>
            ) : (
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    محصولی یافت نشد
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.ErpCode}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 gap-2"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{product.Name}</p>
                        <div className="text-sm text-muted-foreground">
                          {product.MainGroupName && product.SideGroupName && (
                            <span>{product.MainGroupName} / {product.SideGroupName}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between mt-1 sm:mt-0">
                        <div className="font-medium">
                          {formatCurrency(product.SellPrice || 0)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          موجودی: {product.Few || 0}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">دسترسی سریع</CardTitle>
            <CardDescription>
              لینک‌های دسترسی سریع به بخش‌های مختلف
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link 
              href="/invoices" 
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <FiFileText className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">مدیریت فاکتورها</p>
                <p className="text-sm text-muted-foreground">ایجاد و مدیریت فاکتورها</p>
              </div>
            </Link>
            
            <Link 
              href="/products" 
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <FiPackage className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">مدیریت محصولات</p>
                <p className="text-sm text-muted-foreground">مشاهده و مدیریت لیست محصولات</p>
              </div>
            </Link>
            
            <Link 
              href="/customers" 
              className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <FiUsers className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">مدیریت مشتریان</p>
                <p className="text-sm text-muted-foreground">مشاهده و مدیریت لیست مشتریان</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 