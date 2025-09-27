"use client";

import PreInvoiceList, {
  PreInvoiceListRef,
} from "@/components/invoices/PreInvoiceList";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { Toaster, toast } from "sonner";

export default function InvoicesPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const preInvoiceListRef = useRef<PreInvoiceListRef>(null);

  // Refresh the list when the page loads (especially after navigation from create page)
  useEffect(() => {
    const refreshList = async () => {
      if (preInvoiceListRef.current) {
        try {
          setIsRefreshing(true);
          await preInvoiceListRef.current.refresh();
        } catch (error) {
          console.error("Error refreshing pre-invoices:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    refreshList();
  }, []);

  // Handle manual refresh
  const handleRefresh = async () => {
      try {
        setIsRefreshing(true);
      await preInvoiceListRef.current?.refresh();
        toast.success("لیست به‌روزرسانی شد");
      } catch (error) {
        console.error("Error refreshing pre-invoices:", error);
        toast.error("خطا در به‌روزرسانی لیست");
      } finally {
        setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Toaster position="top-center" expand={true} richColors />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            پیش فاکتورها
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            ایجاد و مدیریت پیش فاکتورها - برای مشاهده جزئیات روی دکمه مشاهده کلیک کنید
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            className="flex-1 sm:flex-initial"
            onClick={() => router.push("/invoices/create")}
          >
            <FiPlus className="mr-2 h-4 w-4" />
            پیش فاکتور جدید
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-initial"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FiRefreshCw
              className={`ml-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            به‌روزرسانی
          </Button>
        </div>
      </div>

      <PreInvoiceList ref={preInvoiceListRef} />
    </div>
  );
}
