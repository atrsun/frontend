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
import customerService, {
  HolooCustomer,
} from "@/lib/api/customerService";
import { formatCurrency } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

// Extended customer type to include UI-specific fields
interface ExtendedCustomer extends HolooCustomer {
  joinDate?: string;
  totalSpent?: number;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCustomers, setAllCustomers] = useState<ExtendedCustomer[]>([]); // Store all customers
  const [customers, setCustomers] = useState<ExtendedCustomer[]>([]); // Store paginated customers
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Helper function to get paginated customers
  const getPaginatedCustomers = useCallback((customers: ExtendedCustomer[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return customers.slice(startIndex, endIndex);
  }, []);

  // Update paginated customers when page, itemsPerPage, or allCustomers change
  useEffect(() => {
    if (allCustomers.length > 0) {
      const paginatedCustomers = getPaginatedCustomers(allCustomers, currentPage, itemsPerPage);
      setCustomers(paginatedCustomers);
      setTotalItems(allCustomers.length);
      setTotalPages(Math.ceil(allCustomers.length / itemsPerPage));
    }
  }, [currentPage, itemsPerPage, allCustomers, getPaginatedCustomers]);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching customers...');
      const response = await customerService.getCustomers();
      console.log('Raw API response:', JSON.stringify(response, null, 2));
      
      const extractedCustomers = extractCustomersFromResponse(response);
      console.log('Extracted customers:', extractedCustomers.length);
      
      // Log all customer ErpCodes to check for duplicates
      console.log('All customer ErpCodes:', extractedCustomers.map(c => (c as HolooCustomer).ErpCode));
      
      // Check for duplicates
      const uniqueCustomers = new Map<string, HolooCustomer>();
      interface DuplicateEntry {
        original: HolooCustomer;
        duplicate: HolooCustomer;
      }
      const duplicates: DuplicateEntry[] = [];
      
      extractedCustomers.forEach(customer => {
        const key = customer.ErpCode;
        if (uniqueCustomers.has(key)) {
          duplicates.push({
            original: uniqueCustomers.get(key) as HolooCustomer,
            duplicate: customer
          });
        } else {
          uniqueCustomers.set(key, customer);
        }
      });
      
      if (duplicates.length > 0) {
        console.warn('Found duplicate customers:', duplicates);
      }
      
      // Use unique customers only
      const uniqueCustomerArray = Array.from(uniqueCustomers.values());
      console.log('Unique customers:', uniqueCustomerArray.length);
      
      // Convert to ExtendedCustomer
      const extendedCustomers: ExtendedCustomer[] = uniqueCustomerArray.map(customer => ({
        ...customer,
        joinDate: (customer as any).createdAt || undefined,
        totalSpent: 0
      }));
      
      setAllCustomers(extendedCustomers); // Store all customers
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setAllCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCustomers = useCallback(async () => {
    setLoading(true);
    setIsSearching(true);
    try {
      const response = await customerService.filterCustomers({
        name: searchTerm,
        phone: /^\d+$/.test(searchTerm) ? searchTerm : undefined
      });

      const extractedCustomers = extractCustomersFromResponse(response);
      
      // Convert to ExtendedCustomer
      const extendedCustomers: ExtendedCustomer[] = extractedCustomers.map(customer => ({
        ...customer,
        joinDate: (customer as any).createdAt || undefined,
        totalSpent: 0
      }));
      
      setAllCustomers(extendedCustomers); // Store all customers
      setCurrentPage(1); // Reset to first page
    } catch (error) {
      console.error("Failed to search customers:", error);
      setAllCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Initial load - only fetch once
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle search input changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchCustomers();
      } else if (isSearching) {
        // If search term was cleared, reset to pagination mode
        setIsSearching(false);
        fetchCustomers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, isSearching, searchCustomers, fetchCustomers]);

  // Handle page change - now just updates the current page
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || isSearching) return;
    setCurrentPage(newPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Helper function to extract customers from various response formats
  const extractCustomersFromResponse = (response: any): HolooCustomer[] => {
    console.log("API Response Structure:", JSON.stringify(response, null, 2));

    if (!response) return [];

    // Case 1: If response has status and data array (as per sample-res.json)
    if (response.status === 200 && Array.isArray(response.data)) {
      console.log("Processing standard format with status and data array");
      return response.data;
    }

    // Case 2: If response itself is an array of customers
    if (Array.isArray(response)) {
      console.log("Processing direct array format");
      return response;
    }

    // Case 3: If response has a Customer property that is an array (original format)
    if (response.Customer && Array.isArray(response.Customer)) {
      console.log("Processing format with Customer array property");
      return response.Customer;
    }

    // Case 4: If response has a data property that has a Customer property
    if (
      response.data &&
      response.data.Customer &&
      Array.isArray(response.data.Customer)
    ) {
      console.log("Processing nested format with data.Customer array");
      return response.data.Customer;
    }

    // Case 5: If response has a data property that is an array
    if (response.data && Array.isArray(response.data)) {
      console.log("Processing format with data array property");
      return response.data;
    }

    // Case 6: Single customer object
    if (
      typeof response === "object" &&
      response !== null &&
      Object.keys(response).length > 0
    ) {
      if (response.ErpCode) {
        console.log("Processing single customer object");
        return [response as HolooCustomer];
      }
    }

    console.error("Unrecognized response format:", response);
    return [];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">مشتریان</h1>
          <p className="text-muted-foreground">مدیریت و مشاهده لیست مشتریان</p>
        </div>
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
              onClick={searchCustomers}
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
                    </TableRow>
                  ))
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    هیچ مشتری‌ای یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.ErpCode}>
                    <TableCell className="font-medium">
                      {customer.Name || "-"}
                    </TableCell>
                    <TableCell>{customer.Code || "-"}</TableCell>
                    <TableCell>{customer.Mobile || "-"}</TableCell>
                    <TableCell>
                      {customer.Mandeh !== undefined
                        ? formatCurrency(Number(customer.Mandeh))
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {customer.Credit !== undefined
                        ? formatCurrency(Number(customer.Credit))
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
                  نمایش {customers.length} از {totalItems} مشتری
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
