import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api";
import { formatCurrency, formatPersianDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from "react";
import { FiEye, FiFileText, FiTrash2, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { toast } from "sonner";

interface PreInvoiceApiResponse {
  createdAt: string;
  updatedAt: string;
  Type: string;
  CustomerName?: string;
  Date?: string;
  Time?: string;
  SumNaghd: number;
  SumCard: number;
  SumNesiyeh: number;
  SumDiscount: number;
  SumCheck: number;
  SumLevy: number;
  SumScot: number;
  SumPrice: number;
  CustomerErpCode?: string;
  TypeName?: string;
  Code?: string;
  Detail: Array<{
    Few?: number;
    Price: number;
    SumPrice?: number;
    ProductErpCode: string;
    Quantity?: number;
    _id?: string;
  }>;
  _id: string;
}

export interface PreInvoice {
  id: string;
  code?: string;
  date: string;
  customer_name: string;
  customer_id: string;
  SumPrice: number;
  status: "pending" | "approved" | "rejected";
  hasUsdItems?: boolean;
  usdTotal?: number;
  rialTotal?: number;
  SumDiscount?: number;
}

export interface PreInvoiceListRef {
  refresh: () => void;
}

const PreInvoiceList = forwardRef<PreInvoiceListRef>((props, ref) => {
  const [preInvoices, setPreInvoices] = useState<PreInvoice[]>([]);
  const [allPreInvoices, setAllPreInvoices] = useState<PreInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [convertingInvoiceId, setConvertingInvoiceId] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const getPaginatedInvoices = useCallback((invoices: PreInvoice[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return invoices.slice(startIndex, endIndex);
  }, []);

  useEffect(() => {
    if (allPreInvoices.length > 0) {
      const paginatedInvoices = getPaginatedInvoices(allPreInvoices, currentPage, itemsPerPage);
      setPreInvoices(paginatedInvoices);
      setTotalPages(Math.ceil(allPreInvoices.length / itemsPerPage));
    }
  }, [currentPage, itemsPerPage, allPreInvoices, getPaginatedInvoices]);

  useImperativeHandle(ref, () => ({
    refresh: fetchPreInvoices,
  }));

  useEffect(() => {
    fetchPreInvoices();
  }, []);

  const fetchPreInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<PreInvoiceApiResponse[]>("/pre-invoice/preInvoice");

      if (response.data && Array.isArray(response.data)) {
        const formattedInvoices: PreInvoice[] = await Promise.all(
          response.data.map(async (item) => {
            let formattedDate = "";
            if (item.Date) {
              formattedDate = formatPersianDate(item.Date);
            } else {
              formattedDate = formatPersianDate(item.createdAt);
            }

            let hasUsdItems = false;
            let usdTotal = 0;
            let rialTotal = 0;

            if (item.Detail && Array.isArray(item.Detail)) {
              item.Detail.forEach((detail) => {
                if (detail.Few === 5) {
                  hasUsdItems = true;
                  usdTotal += detail.SumPrice || detail.Price;
                } else {
                  rialTotal += detail.SumPrice || detail.Price * (detail.Few || detail.Quantity || 1);
                }
              });
            }

            return {
              id: item._id,
              code: item.Code || "---",
              date: formattedDate,
              customer_name: item.CustomerName || "مشتری نامشخص",
              customer_id: item.CustomerErpCode || "---",
              SumPrice: item.SumPrice || 0,
              status: "pending",
              hasUsdItems,
              usdTotal,
              rialTotal,
              SumDiscount:item.SumDiscount
            };
          }),
        );

        setAllPreInvoices(formattedInvoices.reverse());
        setCurrentPage(1);
      } else {
        toast.error("فرمت پاسخ سرور نامعتبر است");
      }
    } catch (error) {
      console.error("Error fetching pre invoices:", error);
      toast.error("خطا در بارگیری پیش فاکتورها");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInvoice = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("آیا از حذف این پیش فاکتور اطمینان دارید؟")) {
      return;
    }

    try {
      await apiClient.delete(`/pre-invoice/preInvoice/${id}`);
      toast.success("پیش فاکتور با موفقیت حذف شد");
      setAllPreInvoices((prevInvoices) => prevInvoices.filter((inv) => inv.id !== id));
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("خطا در حذف پیش فاکتور");
    }
  };

  const handleOpenConvertDialog = (id: string) => {
    setConvertingInvoiceId(id);
    setIsConfirmDialogOpen(true);
  };

  const handleConvertToInvoice = async () => {
    if (!convertingInvoiceId) return;

    setIsConverting(true);
    try {
      await apiClient.post("/invoice", { preInvoiceId: convertingInvoiceId });
      toast.success("پیش فاکتور با موفقیت به فاکتور تبدیل شد");
      setIsConfirmDialogOpen(false);
      setConvertingInvoiceId(null);
      fetchPreInvoices();
    } catch (err) {
      const error = err as any;
      console.error("Error converting to invoice:", error);
      
      let errorMessage = "خطا در تبدیل پیش فاکتور به فاکتور";
      
      if (error?.response?.status === 404 && error?.response?.data?.message === "customer have no required credit") {
        errorMessage = "مشتری اعتبار لازم را ندارد";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">در حال بارگیری...</p>
            </div>
          ) : allPreInvoices.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">لیست پیش فاکتورها</h3>
              <p className="text-muted-foreground">هیچ پیش فاکتوری یافت نشد</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">لیست پیش فاکتورها</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-right border">شماره</th>
                      <th className="p-2 text-right border">تاریخ</th>
                      <th className="p-2 text-right border">مشتری</th>
                      <th className="p-2 text-right border">مبلغ (ریال)</th>
                      <th className="p-2 text-right border">مبلغ (دلار)</th>
                      <th className="p-2 text-right border">وضعیت</th>
                      <th className="p-2 text-center border">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/50">
                        <td className="p-2 border">{invoice.code}</td>
                        <td className="p-2 border">{invoice.date}</td>
                        <td className="p-2 border">{invoice.customer_name}</td>
                        <td className="p-2 border">
                          {invoice.rialTotal && invoice.rialTotal > 0
                            ? formatCurrency(invoice.rialTotal - (invoice.SumDiscount?invoice.SumDiscount:0))
                            : "-"}
                        </td>
                        <td className="p-2 border">
                          {invoice.hasUsdItems && invoice.usdTotal && invoice.usdTotal > 0
                            ? `${formatCurrency(invoice.usdTotal-  (invoice.SumDiscount?invoice.SumDiscount:0))} $`
                            : "-"}
                        </td>
                        <td className="p-2 border">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-50 text-yellow-700 border-yellow-300">
                            در انتظار
                          </span>
                        </td>
                        <td className="p-2 border text-center">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewInvoice(invoice.id)}
                              title="مشاهده"
                            >
                              <FiEye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenConvertDialog(invoice.id)}
                              title="تبدیل به فاکتور"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FiFileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              title="حذف"
                              className="text-red-500 hover:text-red-700"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    تعداد نمایش:
                  </span>
                  <select
                    className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    disabled={isLoading}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-muted-foreground">
                    نمایش {preInvoices.length} از {allPreInvoices.length} پیش فاکتور
                  </span>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2 space-x-reverse">
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
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تبدیل پیش فاکتور به فاکتور</DialogTitle>
            <DialogDescription>
              آیا از تبدیل این پیش فاکتور به فاکتور اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={isConverting}
            >
              انصراف
            </Button>
            <Button
              onClick={handleConvertToInvoice}
              disabled={isConverting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isConverting ? "در حال تبدیل..." : "تبدیل به فاکتور"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

PreInvoiceList.displayName = "PreInvoiceList";

export default PreInvoiceList;