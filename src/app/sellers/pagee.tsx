"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import sellerService, {
  HolooSeller,
  SellerFilterParams,
  SellerListParams,
} from "@/lib/api/sellerService";
import { formatCurrency } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

// Extended seller type to include UI-specific fields
interface ExtendedSeller extends HolooSeller {
  joinDate?: string;
  totalSales?: number;
}

export default function SellersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sellers, setSellers] = useState<ExtendedSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Function to fetch sellers with pagination
  const fetchSellers = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const params: SellerListParams = {
        page,
        limit,
      };

      const data = await sellerService.getSellers(params);

      // Ensure data is an array
      let sellersArray: HolooSeller[] = [];

      if (Array.isArray(data)) {
        sellersArray = data;
      } else if (data && typeof data === "object") {
        // If it's an object with a data property that's an array
        if (Array.isArray((data as any).data)) {
          sellersArray = (data as any).data;
        } else if (data && Object.keys(data).length > 0) {
          // If it's a single seller object, wrap it in an array
          sellersArray = [data as unknown as HolooSeller];
        }
      }

      setSellers(sellersArray);

      // For pagination, we'll use a fixed number for total items
      // In a real app, this would come from the API response metadata
      const estimatedTotal = 100; // Assuming there are 100 total sellers
      setTotalItems(estimatedTotal);
      setTotalPages(Math.ceil(estimatedTotal / limit));
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to search sellers using the API
  const searchSellers = async () => {
    if (!searchTerm.trim()) {
      // If search is cleared, revert to regular pagination
      setIsSearching(false);
      fetchSellers(1, itemsPerPage);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);

      const params: SellerFilterParams = {};

      // Determine if search term is likely a name or phone number
      if (/^\d+$/.test(searchTerm)) {
        // If it's all digits, search by phone
        params.phone = searchTerm;
      } else {
        // Otherwise search by name
        params.name = searchTerm;
      }

      const data = await sellerService.filterSellers(params);

      // Ensure data is an array
      let sellersArray: HolooSeller[] = [];

      if (Array.isArray(data)) {
        sellersArray = data;
      } else if (data && typeof data === "object") {
        // If it's an object with a data property that's an array
        if (Array.isArray((data as any).data)) {
          sellersArray = (data as any).data;
        } else if (data && Object.keys(data).length > 0) {
          // If it's a single seller object, wrap it in an array
          sellersArray = [data as unknown as HolooSeller];
        }
      }

      setSellers(sellersArray);
      setTotalItems(sellersArray.length);
      setCurrentPage(1);
      setTotalPages(1); // Search results are not paginated in this implementation
    } catch (error) {
      console.error("Failed to search sellers:", error);
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSellers(1, itemsPerPage);
  }, [itemsPerPage]);

  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchSellers();
      } else if (isSearching) {
        // If search term was cleared, reset to pagination mode
        setIsSearching(false);
        fetchSellers(1, itemsPerPage);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || isSearching) return;
    fetchSellers(newPage, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    fetchSellers(1, newLimit); // Reset to first page when changing items per page
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">فروشندگان</h1>
          <p className="text-muted-foreground">
            مدیریت و مشاهده لیست فروشندگان
          </p>
        </div>
        {/* <Button>
          <FiPlus className="mr-2 h-4 w-4" />
          افزودن فروشنده
        </Button> */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              placeholder="جستجو بر اساس نام، کد یا شماره تماس"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="outline"
              size="icon"
              disabled={loading}
              onClick={searchSellers}
            >
              <FiSearch className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>نام</TableHead>
                <TableHead>کد</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>مانده حساب</TableHead>
                <TableHead>اعتبار</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>پورسانت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-5 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[90px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[90px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[60px]" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : sellers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    هیچ فروشنده‌ای یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                sellers.map((seller) => (
                  <TableRow key={seller.ErpCode}>
                    <TableCell className="font-medium">
                      {seller.Name || "-"}
                    </TableCell>
                    <TableCell>{seller.Code || "-"}</TableCell>
                    <TableCell>{seller.Mobile || "-"}</TableCell>
                    <TableCell>
                      {seller.Mandeh !== undefined
                        ? formatCurrency(Number(seller.Mandeh))
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {seller.Credit !== undefined
                        ? formatCurrency(Number(seller.Credit))
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          seller.IsActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {seller.IsActive ? "فعال" : "غیرفعال"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {seller.VasetehPorsant !== undefined
                        ? `${seller.VasetehPorsant}%`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!loading && !isSearching && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  تعداد نمایش:
                </span>
                <select
                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  disabled={loading}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-muted-foreground">
                  نمایش {sellers.length} از {totalItems} فروشنده
                </span>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
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
                    disabled={currentPage === totalPages || loading}
                  >
                    <FiChevronLeft className="h-4 w-4" />
                    <span className="sr-only">صفحه بعد</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
