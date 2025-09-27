"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/data/products";
import { productService } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const fetchProducts = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts({
        page,
        limit,
        name: searchTerm,
      });

      if (response.product && Array.isArray(response.product)) {
        // Convert HolooProduct[] to Product[]
        const convertedProducts: Product[] = response.product.map(p => ({
            id: p.ErpCode || "",
            name: p.Name || "",
            description: p.MainGroupName
              ? `${p.MainGroupName} / ${p.SideGroupName}`
              : "",
            price: p.SellPrice || 0,
            persianName: p.Name || "",
            category: p.MainGroupName || "",
            stock: p.Few || 0,
            image: "",
            isActive: p.IsActive || false,
            other1: p.Other1 || "",
            other2: p.Other2 || "",
            code: p.Code || "",
        }));

        setProducts(convertedProducts);
        // Use a fixed number for total items if not provided by API
        const estimatedTotal = isSearching ? convertedProducts.length : 100;
        setTotalItems(estimatedTotal);
        setTotalPages(Math.ceil(estimatedTotal / limit));
        setCurrentPage(page);
      } else if (response.product && !Array.isArray(response.product)) {
        // Handle single product response
        const p = response.product;
        setProducts([{
            id: p.ErpCode || "",
            name: p.Name || "",
            description: p.MainGroupName
              ? `${p.MainGroupName} / ${p.SideGroupName}`
              : "",
            price: p.SellPrice || 0,
            persianName: p.Name || "",
            category: p.MainGroupName || "",
            stock: p.Few || 0,
            image: "",
            isActive: p.IsActive || false,
            other1: p.Other1 || "",
            other2: p.Other2 || "",
            code: p.Code || "",
        }]);

        setTotalItems(1);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        // Empty response
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("خطا در دریافت لیست محصولات");
      setProducts([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, isSearching]);

  const searchProducts = useCallback(async () => {
    setIsSearching(true);
    try {
      const response = await productService.getProducts({
        name: searchTerm,
        limit: itemsPerPage,
      });

      if (response.product && Array.isArray(response.product)) {
        // Convert HolooProduct[] to Product[]
        const convertedProducts: Product[] = response.product.map(p => ({
          id: p.ErpCode || "",
          name: p.Name || "",
          description: p.MainGroupName
            ? `${p.MainGroupName} / ${p.SideGroupName}`
            : "",
          price: p.SellPrice || 0,
          persianName: p.Name || "",
          category: p.MainGroupName || "",
          stock: p.Few || 0,
          image: "",
          isActive: p.IsActive || false,
          other1: p.Other1 || "",
          other2: p.Other2 || "",
          code: p.Code || "",
        }));

        setProducts(convertedProducts);
        const estimatedTotal = convertedProducts.length;
        setTotalItems(estimatedTotal);
        setTotalPages(Math.ceil(estimatedTotal / itemsPerPage));
      } else {
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to search products:", error);
      setProducts([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, itemsPerPage]);

  // Initial load
  useEffect(() => {
    fetchProducts(1, itemsPerPage);
  }, [itemsPerPage, fetchProducts]);

  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchProducts();
      } else if (isSearching) {
        // If search term was cleared, reset to pagination mode
        setIsSearching(false);
        fetchProducts(1, itemsPerPage);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, isSearching, itemsPerPage, searchProducts, fetchProducts]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchProducts(newPage, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    fetchProducts(1, newLimit); // Reset to first page when changing items per page
  };

  // Delete product
  const handleDelete = async (id: number | string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;

    try {
      setProducts(products.filter((product) => product.id !== id));

      toast({
        title: "محصول با موفقیت حذف شد",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "خطا در حذف محصول",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            محصولات
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            مدیریت و مشاهده لیست محصولات
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <FiPlus className="mr-2 h-4 w-4" />
          افزودن محصول
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg sm:text-xl">لیست محصولات</CardTitle>
            <CardDescription>
              مجموعاً {totalItems} محصول در سیستم ثبت شده است
            </CardDescription>
          </div>
          <div className="flex items-center w-full sm:w-auto">
            <Input
              placeholder="جستجو..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[250px]"
            />
            <Button
              type="submit"
              variant="outline"
              size="icon"
              disabled={isLoading}
              onClick={searchProducts}
              className="ms-2"
            >
              <FiSearch className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : (
            <>
              {/* Table for larger screens */}
              <div className="hidden sm:block overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>کد</TableHead>
                      <TableHead>نام محصول</TableHead>
                      <TableHead>قیمت</TableHead>
                      <TableHead>موجودی</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-left">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          محصولی یافت نشد
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.code}</TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div>{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-muted-foreground">
                                  {product.description}
                                </div>
                              )}
                              {product.other1 && (
                                <div className="text-xs text-muted-foreground">
                                  {product.other1}
                                </div>
                              )}
                              {product.other2 && (
                                <div className="text-xs text-muted-foreground">
                                  {product.other2}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                product.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.isActive ? "فعال" : "غیرفعال"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <FiEdit className="h-4 w-4" />
                                <span className="sr-only">ویرایش</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(product.id)}
                              >
                                <FiTrash2 className="h-4 w-4" />
                                <span className="sr-only">حذف</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Card layout for mobile screens */}
              <div className="sm:hidden space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    محصولی یافت نشد
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.code}
                          </div>
                        </div>
                        <div className="flex">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <FiEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(product.id)}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {product.description && (
                        <div className="text-sm text-muted-foreground">
                          {product.description}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 mt-2 border-t">
                        <div className="font-medium">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">موجودی: {product.stock}</div>
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                          >
                            {product.isActive ? "فعال" : "غیرفعال"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    تعداد نمایش:
                  </span>
                  <select
                    className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    disabled={isLoading}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    نمایش {products.length} از {totalItems} محصول
                  </span>
                </div>

                <div className="flex items-center justify-center sm:justify-end space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <FiChevronRight className="h-4 w-4" />
                    <span className="sr-only">صفحه قبل</span>
                  </Button>
                  <div className="text-sm font-medium">
                    صفحه {currentPage} از {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                  >
                    <FiChevronLeft className="h-4 w-4" />
                    <span className="sr-only">صفحه بعد</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
