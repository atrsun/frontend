"use client"

import InvoiceList, { type InvoiceListRef } from "@/components/invoices/InvoiceList"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { FiRefreshCw } from "react-icons/fi"
import { Toaster, toast } from "sonner"

export default function SalesPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const invoiceListRef = useRef<InvoiceListRef>(null)

  useEffect(() => {
    const refreshList = async () => {
      if (invoiceListRef.current) {
        try {
          setIsRefreshing(true)
          await invoiceListRef.current.refreshInvoices()
        } catch (error) {
          console.error("Error refreshing invoices:", error)
        } finally {
          setIsRefreshing(false)
        }
      }
    }

    refreshList()
  }, [])

  const handleRefresh = async () => {
    if (invoiceListRef.current) {
      try {
        setIsRefreshing(true)
        await invoiceListRef.current.refreshInvoices()
        toast.success("لیست به‌روزرسانی شد")
      } catch (error) {
        console.error("Error refreshing invoices:", error)
        toast.error("خطا در به‌روزرسانی لیست")
      } finally {
        setIsRefreshing(false)
      }
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Toaster position="top-center" expand={true} richColors />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">فاکتورها</h1>
          <p className="text-sm sm:text-base text-muted-foreground">مشاهده و مدیریت فاکتورهای ثبت شده</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-initial" onClick={handleRefresh} disabled={isRefreshing}>
            <FiRefreshCw className={`ml-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            به‌روزرسانی
          </Button>
        </div>
      </div>

      <InvoiceList ref={invoiceListRef} />
    </div>
  )
}
