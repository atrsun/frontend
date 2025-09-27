"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import { useEffect, useState } from "react"
import { FiLoader, FiPrinter } from "react-icons/fi"
import { toast } from "sonner"

export interface InvoiceDetail {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  is_usd_price: boolean
  discount_percent: string
  total: number
}

export interface InvoiceDetailsProps {
  isOpen: boolean
  onClose: () => void
  invoice: {
    id: string
    date: string
    customer_name: string
    customer_id: string
    status: "paid" | "pending" | "cancelled"
    details: InvoiceDetail[]
    totals: {
      rialSubtotal: number
      usdSubtotal: number
      rialTotal: number
      usdTotal: number
    }
  } | null
  onPrint?: (id: string) => void
}

interface ProductDetails {
  Name: string
  ErpCode: string
  SellPrice: number
}

export default function InvoiceDetails({ isOpen, onClose, invoice, onPrint }: InvoiceDetailsProps) {
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  useEffect(() => {
    if (invoice && isOpen) {
      fetchProductDetails()
    }
  }, [invoice, isOpen])

  const fetchProductDetails = async () => {
    if (!invoice || !invoice.details.length) return

    setIsLoadingProducts(true)

    try {
      const mockProducts: Record<string, ProductDetails> = {}

      for (const detail of invoice.details) {
        mockProducts[detail.product_id] = {
          Name: detail.product_name,
          ErpCode: detail.product_id,
          SellPrice: detail.unit_price,
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error)
      toast.error("خطا در بارگیری اطلاعات محصولات")
    } finally {
      setIsLoadingProducts(false)
    }
  }

  if (!invoice) return null

  const getStatusText = (status: "paid" | "pending" | "cancelled") => {
    switch (status) {
      case "pending":
        return "در انتظار"
      case "paid":
        return "پرداخت شده"
      case "cancelled":
        return "لغو شده"
      default:
        return ""
    }
  }

  const getStatusClass = (status: "paid" | "pending" | "cancelled") => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-300"
      case "paid":
        return "bg-green-50 text-green-700 border border-green-300"
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-300"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between items-center">
            <span>جزئیات فاکتور {invoice.id}</span>
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusClass(invoice.status)}`}>
              {getStatusText(invoice.status)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 border rounded">
            <div className="font-medium mb-1">مشتری</div>
            <div>{invoice.customer_name}</div>
            <div className="text-sm text-muted-foreground">کد: {invoice.customer_id}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="font-medium mb-1">تاریخ</div>
            <div>{invoice.date}</div>
          </div>
        </div>

        <div className="border rounded">
          <div className="font-medium p-3 border-b flex justify-between items-center">
            <span>اقلام فاکتور</span>
            {isLoadingProducts && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FiLoader className="animate-spin mr-2" />
                <span>در حال بارگیری جزئیات محصولات...</span>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="p-2 text-right border">ردیف</th>
                  <th className="p-2 text-right border">نام محصول</th>
                  <th className="p-2 text-right border">تعداد</th>
                  <th className="p-2 text-right border">قیمت واحد</th>
                  <th className="p-2 text-right border">تخفیف</th>
                  <th className="p-2 text-right border">مبلغ کل</th>
                </tr>
              </thead>
              <tbody>
                {invoice.details.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="p-2 border">{index + 1}</td>
                    <td className="p-2 border">
                      <div>{item.product_name}</div>
                      <div className="text-xs text-muted-foreground">کد: {item.product_id}</div>
                    </td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">
                      {item.is_usd_price ? `${item.unit_price} USD` : formatCurrency(item.unit_price)}
                    </td>
                    <td className="p-2 border">{item.discount_percent ? `${item.discount_percent}%` : "0%"}</td>
                    <td className="p-2 border">
                      {item.is_usd_price ? `${item.total} USD` : formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            {invoice.status === "paid" && (
              <div className="p-3 border rounded bg-green-50 text-green-700">
                <div className="font-medium">اطلاعات پرداخت</div>
                <div className="text-sm">این فاکتور پرداخت شده است.</div>
              </div>
            )}

            {invoice.status === "cancelled" && (
              <div className="p-3 border rounded bg-red-50 text-red-700">
                <div className="font-medium">اطلاعات لغو</div>
                <div className="text-sm">این فاکتور لغو شده است.</div>
              </div>
            )}
          </div>
          <div className="space-y-2 text-left">
            {invoice.totals.rialSubtotal > 0 && (
              <div className="flex justify-between">
                <span>جمع کل (ریال):</span>
                <span className="font-medium">{formatCurrency(invoice.totals.rialSubtotal)}</span>
              </div>
            )}

            {invoice.totals.usdSubtotal > 0 && (
              <div className="flex justify-between">
                <span>جمع کل (دلار):</span>
                <span className="font-medium">{invoice.totals.usdSubtotal} USD</span>
              </div>
            )}

            {invoice.totals.rialTotal > 0 && (
              <div className="flex justify-between font-bold">
                <span>مبلغ نهایی (ریال):</span>
                <span>{formatCurrency(invoice.totals.rialTotal)}</span>
              </div>
            )}

            {invoice.totals.usdTotal > 0 && (
              <div className="flex justify-between font-bold">
                <span>مبلغ نهایی (دلار):</span>
                <span>{invoice.totals.usdTotal} USD</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {onPrint && (
              <Button variant="outline" onClick={() => onPrint(invoice.id)}>
                <FiPrinter className="mr-2 h-4 w-4" />
                چاپ
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} className="mr-2">
              بستن
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
