"use client";

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
import { downloadInvoicePDF } from "@/lib/pdf";
import { formatCurrency, formatPersianDate } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight, FiDownload, FiTrash2 } from "react-icons/fi";
import { Toaster, toast } from "sonner";

interface PreInvoiceDetail {
  Few?: number;
  Price: number;
  SumPrice?: number;
  ProductErpCode: string;
  Code?: string;
  Quantity?: number;
  discountpercent?: number;
  _id?: string;
  ProductName?: string;
  isUSD?: boolean;
  Discount?: string;
  MainGroupName?: string;
}

interface PreInvoiceData {
  _id: string;
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
  ErpCode?: string;
  TypeName?: string;
  Detail: PreInvoiceDetail[];
  totalPrice?: number;
  VasetErpCode?: string;
  Code?: string;
}

export default function PreInvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [preInvoice, setPreInvoice] = useState<PreInvoiceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [usdTotal, setUsdTotal] = useState(0);
  const [rialTotal, setRialTotal] = useState(0);
  const invoiceId = params.id as string;

  useEffect(() => {
    if (invoiceId) {
      fetchPreInvoice(invoiceId);
    }
  }, [invoiceId]);

  const fetchPreInvoice = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/pre-invoice/preInvoice/${id}`);
      if (response.data) {
        const detailsWithProductInfo = await Promise.all(
          response.data.Detail.map(async (detail: PreInvoiceDetail) => {
            try {
              // Get product details from product API
              const productResponse = await apiClient.get(`/holoo/product`, {
                params: {
                  erpcode: detail.ProductErpCode
                }
              });

              const productData = productResponse.data?.product;
              if (productData) {
              return {
                ...detail,
                  Code: Array.isArray(productData) ? productData[0]?.Code : productData.Code,
                  ProductName: Array.isArray(productData) ? productData[0]?.Name : productData.Name,
                  MainGroupName: Array.isArray(productData) ? productData[0]?.MainGroupName : productData.MainGroupName,
                isUSD: detail.Few === 5,
                  Discount: detail.Discount || "0",
              };
              }
            } catch (error) {
              console.error("Error fetching product details:", error);
            }
            return {
              ...detail,
              isUSD: detail.Few === 5,
              Discount: detail.Discount || "0",
            };
          }),
        );

        let usdSum = 0;
        let rialSum = 0;

        detailsWithProductInfo.forEach((item) => {
          if (item.isUSD) {
            usdSum += item.SumPrice || item.Price;
          } else {
            rialSum +=
              item.SumPrice || item.Price * (item.Few || item.Quantity || 1);
          }
        });

        setUsdTotal(usdSum);
        setRialTotal(rialSum);

        setPreInvoice({
          ...response.data,
          Detail: detailsWithProductInfo,
        });
      }
    } catch (error) {
      console.error("Error fetching pre-invoice:", error);
      toast.error("خطا در بارگیری اطلاعات پیش فاکتور");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(`/pre-invoice/preInvoice/${invoiceId}`);
      toast.success("پیش فاکتور با موفقیت حذف شد");
      setIsDeleteDialogOpen(false);
      router.push("/invoices");
    } catch (error) {
      console.error("Error deleting pre-invoice:", error);
      toast.error("خطا در حذف پیش فاکتور");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!preInvoice) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">پیش فاکتور یافت نشد</h2>
        <p className="text-muted-foreground mb-6">
          پیش فاکتور مورد نظر در سیستم موجود نیست
        </p>
        <Button onClick={() => router.push("/invoices")}>
          <FiArrowRight className="ml-2" />
          بازگشت به لیست پیش فاکتورها
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" expand={true} richColors />

      {/* هدر و دکمه‌ها ریسپانسیو */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            جزئیات پیش فاکتور
          </h1>
          <p className="text-muted-foreground">
            مشاهده اطلاعات کامل پیش فاکتور
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
          <Button variant="outline" onClick={() => router.push("/invoices")}>
            <FiArrowRight className="ml-2 h-4 w-4" />
            بازگشت
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              if (!preInvoice) return;
              const details = preInvoice.Detail.map((item) => ({
                product_id: item.ProductErpCode,
                product_name: item.ProductName || `محصول ${item.ProductErpCode}`,
                quantity: item.isUSD ? 1 : item.Few || item.Quantity || 1,
                unit_price: item.Price,
                is_usd_price: !!item.isUSD,
                discount_percent: `${item.discountpercent}` || "0",
                total: item.SumPrice || (item.Price * (item.isUSD ? 1 : item.Few || item.Quantity || 1)),
              }));
              
              const totals = {
                rialSubtotal: details
                  .filter((d) => !d.is_usd_price)
                  .reduce((sum, d) => sum + d.total, 0),
                usdSubtotal: details
                  .filter((d) => d.is_usd_price)
                  .reduce((sum, d) => sum + d.total, 0),
                rialTotal:
                  preInvoice.totalPrice !== undefined
                    ?( preInvoice.totalPrice - preInvoice.SumDiscount)
                    : (rialTotal- preInvoice.SumDiscount),
                usdTotal: (usdTotal- preInvoice.SumDiscount),
              };
              try {
                await downloadInvoicePDF({
                  id: preInvoice.Code || preInvoice._id,
                  date: formatPersianDate(
                    preInvoice.Date || preInvoice.createdAt,
                  ),
                  customer_name: preInvoice.CustomerName || "مشتری نامشخص",
                  customer_id: preInvoice.CustomerErpCode || "---",
                  details,
                  totals,
                  sellerInfo: {
                    name: "شرکت تجهیزات آقای هاشمی الهی الرحمن",
                    phone: "09124535035",
                    address: "فارس-شیراز، مجتمع گین فارس",
                  },
                });
              } catch (error) {
                console.error("Error generating PDF:", error);
                toast.error("خطا در ایجاد فایل PDF");
              }
            }}
          >
            <FiDownload className="ml-2 h-4 w-4" />
            دانلود PDF
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <FiTrash2 className="ml-2 h-4 w-4" />
            حذف پیش فاکتور
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                کد پیش فاکتور
              </h3>
              <p className="font-medium">{preInvoice.Code || "---"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ صدور
              </h3>
              <p className="font-medium">
                 {formatPersianDate(preInvoice.Date || preInvoice.createdAt)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                زمان صدور
              </h3>
              <p className="font-medium">{preInvoice.Time || "---"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                نام مشتری
              </h3>
              <p className="font-medium">
                {preInvoice.CustomerName || "مشتری نامشخص"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                نوع فاکتور
              </h3>
              <p className="font-medium">{preInvoice.TypeName || "---"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4">اقلام پیش فاکتور</h2>
        <div className="space-y-2">
          {/* عناوین ستون‌ها - فقط در دسکتاپ */}
          <div className="hidden md:flex items-center gap-2 px-2">
            <div className="flex-shrink-0 w-[50px]">
              <div className="text-sm text-muted-foreground">ردیف</div>
            </div>
            <div className="flex-shrink-0 w-[120px]">
              <div className="text-sm text-muted-foreground">انبار</div>
            </div>
            <div className="flex-shrink-0 w-[100px]">
              <div className="text-sm text-muted-foreground">کد محصول</div>
            </div>
            <div className="flex-grow">
              <div className="text-sm text-muted-foreground">نام محصول</div>
            </div>
            <div className="flex-shrink-0 w-[80px] text-center">
              <div className="text-sm text-muted-foreground">تعداد</div>
            </div>
            <div className="flex-shrink-0 w-[150px] text-left">
              <div className="text-sm text-muted-foreground">قیمت واحد</div>
            </div>
            <div className="flex-shrink-0 w-[80px] text-center">
              <div className="text-sm text-muted-foreground">تخفیف %</div>
            </div>
            <div className="flex-shrink-0 w-[150px] text-left">
              <div className="text-sm text-muted-foreground">قیمت کل</div>
            </div>
          </div>

          {/* لیست آیتم‌ها - دسکتاپ */}
          <div className="hidden md:block">
            {preInvoice.Detail.map((item, index) => {
              const quantity = item.isUSD ? 1 : item.Few || item.Quantity || 1;
              const unitPrice = item.Price;
              const discountPercent = parseFloat(`${item.discountpercent}` || "0");
              const total = item.SumPrice || (unitPrice * quantity);
              const discountAmount = (total * discountPercent) / 100;
              const finalTotal = total - discountAmount;

              return (
                <div
                  key={item._id || index}
                  className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg"
                >
                  <div className="flex-shrink-0 w-[50px]">
                    <div className="text-sm font-medium">{index + 1}</div>
                  </div>

                  <div className="flex-shrink-0 w-[120px]">
                    <div className="text-sm font-medium">{item.MainGroupName || "انبار مرکزی"}</div>
                  </div>

                  <div className="flex-shrink-0 w-[100px]">
                    <div className="text-sm font-medium">{item.Code || "---"}</div>
                  </div>

                  <div className="flex-grow">
                    <div className="text-sm font-medium">{item.ProductName}</div>
                  </div>

                  <div className="flex-shrink-0 w-[80px] text-center">
                    <div className="text-sm font-medium">{quantity}</div>
                  </div>

                  <div className="flex-shrink-0 w-[150px] text-left">
                    <div className="text-sm font-medium">{formatCurrency(unitPrice, item.isUSD)}</div>
                  </div>

                  <div className="flex-shrink-0 w-[80px] text-center">
                    <div className="text-sm font-medium">{item.discountpercent}%</div>
                  </div>

                  <div className="flex-shrink-0 w-[150px] text-left">
                    <div className="text-sm font-medium">{formatCurrency(finalTotal, item.isUSD)}</div>
                    {discountPercent > 0 && (
                      <div className="text-xs text-muted-foreground">
                        تخفیف: {formatCurrency(discountAmount, item.isUSD)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* لیست آیتم‌ها - موبایل */}
          <div className="md:hidden space-y-4">
            {preInvoice.Detail.map((item, index) => {
              const quantity = item.isUSD ? 1 : item.Few || item.Quantity || 1;
              const unitPrice = item.Price;
              const discountPercent = parseFloat(`${item.discountpercent}` || "0");
              const total = item.SumPrice || (unitPrice * quantity);
              const discountAmount = (total * discountPercent) / 100;
              const finalTotal = total - discountAmount;

              return (
                <div
                  key={item._id || index}
                  className="bg-muted/30 p-4 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-sm text-muted-foreground">ردیف {index + 1}</div>
                    <div className="text-sm text-muted-foreground">{item.MainGroupName || "انبار مرکزی"}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">{item.ProductName}</div>
                    <div className="text-xs text-muted-foreground mt-1">کد: {item.Code || "---"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground">تعداد</div>
                      <div className="text-sm font-medium">{quantity}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">قیمت واحد</div>
                      <div className="text-sm font-medium">{formatCurrency(unitPrice, item.isUSD)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">تخفیف</div>
                      <div className="text-sm font-medium">{item.discountpercent}`%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">قیمت کل</div>
                      <div className="text-sm font-medium">{formatCurrency(finalTotal, item.isUSD)}</div>
                      {discountPercent > 0 && (
                        <div className="text-xs text-red-500">
                          تخفیف: {formatCurrency(discountAmount, item.isUSD)}
                        </div>
                    )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {usdTotal > 0 && (
              <div className="flex justify-between items-center">
                <h3 className="font-bold">جمع کل (دلار)</h3>
                <p className="font-bold text-xl">
                  {formatCurrency(usdTotal, true)} $
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <h3 className="font-bold">جمع کل (ریال)</h3>
              <p className="font-bold text-xl">
                {formatCurrency(
                  preInvoice.totalPrice !== undefined
                    ? preInvoice.totalPrice -  (preInvoice.SumDiscount)
                    : rialTotal - (preInvoice.SumDiscount),
                  false,
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  مبلغ نقدی
                </h4>
                <p>{formatCurrency(preInvoice.SumNaghd, false)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  مبلغ کارت
                </h4>
                <p>{formatCurrency(preInvoice.SumCard, false)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  مبلغ نسیه
                </h4>
                <p>{formatCurrency(preInvoice.SumNesiyeh, false)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                  تخفیف
                </h4>
                <p>{formatCurrency(preInvoice.SumDiscount, false)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف پیش فاکتور</DialogTitle>
            <DialogDescription>
              آیا از حذف این پیش فاکتور اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              انصراف
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="ml-2">در حال حذف</span>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </>
              ) : (
                "حذف پیش فاکتور"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}