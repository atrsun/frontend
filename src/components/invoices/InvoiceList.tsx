import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { apiClient } from "@/lib/api"
import { formatCurrency, formatPersianDate } from "@/lib/utils"
import { forwardRef, useEffect, useImperativeHandle, useState, useCallback } from "react"
import { FiEye, FiChevronRight, FiChevronLeft } from "react-icons/fi"
import { toast } from "sonner"

interface InvoiceApiResponse {
  createdAt: string
  updatedAt: string
  Code?: string
  CustomerName?: string
  Date?: string
  SumPrice: number
  CustomerErpCode?: string
  InvoiceNumber?: string
  PreInvoiceNumber?: string
  Detail: Array<{
    Few?: number
    Price: number
    SumPrice?: number
    ProductErpCode: string
    ProductName?: string
    Discount?: number
    discount_percent?: number
    _id?: string
  }>
  _id: string
}

export interface Invoice {
  id: string
  invoice_number: string
  date: string
  customer_name: string
  customer_id: string
  SumPrice: number
  status: "approved"
  hasUsdItems?: boolean
  usdTotal?: number
  rialTotal?: number
}

export interface InvoiceListRef {
  refreshInvoices: () => Promise<void>
}

const InvoiceList = forwardRef<InvoiceListRef>((props, ref) => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  const getPaginatedInvoices = useCallback((invoices: Invoice[], page: number, limit: number) => {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return invoices.slice(startIndex, endIndex)
  }, [])

  useEffect(() => {
    if (allInvoices.length > 0) {
      const paginatedInvoices = getPaginatedInvoices(allInvoices, currentPage, itemsPerPage)
      setInvoices(paginatedInvoices)
      setTotalPages(Math.ceil(allInvoices.length / itemsPerPage))
    }
  }, [currentPage, itemsPerPage, allInvoices, getPaginatedInvoices])

  useImperativeHandle(ref, () => ({ refreshInvoices: fetchInvoices }))

  useEffect(() => { fetchInvoices() }, [])

  const fetchInvoices = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<InvoiceApiResponse[]>("/invoice")

      if (response.data && Array.isArray(response.data)) {
        const formattedInvoices = response.data.map((item) => {
          let hasUsdItems = false
          let usdTotal = 0
          let rialTotal = 0

          if (item.Detail && Array.isArray(item.Detail)) {
            item.Detail.forEach((detail) => {
              if (detail.Few === 5) {
                hasUsdItems = true
                usdTotal += detail.SumPrice || detail.Price
              } else {
                rialTotal += detail.SumPrice || detail.Price * (detail.Few || 1)
              }
            })
          }

          let formattedDate = ""
          if (item.Date) {
            formattedDate = formatPersianDate(item.Date)
          } else {
            formattedDate = formatPersianDate(item.createdAt)
          }

          return {
            id: item._id,
            invoice_number: item.Code || "---",
            date: formattedDate,
            customer_name: item.CustomerName || "مشتری نامشخص",
            customer_id: item.CustomerErpCode || "---",
            SumPrice: item.SumPrice || 0,
            status: "approved" as const,
            hasUsdItems,
            usdTotal,
            rialTotal,
          }
        })

        setAllInvoices(formattedInvoices.reverse())
        setCurrentPage(1)
      } else {
        toast.error("فرمت پاسخ سرور نامعتبر است")
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
      toast.error("خطا در بارگیری فاکتورها")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit)
    setCurrentPage(1)
  }

  const handleViewInvoice = async (id: string) => {
    try {
      const invoice = invoices.find((inv) => inv.id === id)
      if (!invoice) return toast.error("فاکتور یافت نشد")

      const response = await apiClient.get<InvoiceApiResponse>(`/invoice/${id}`)
      const invoiceData = response.data

      // جزییات اقلام فاکتور
      const details = invoiceData.Detail.map((item, idx) => {
        // تخفیف درصدی یا عددی
        const discountPercent = item.discount_percent ?? item.Discount ?? 0
        const price = item.Price
        const quantity = item.Few || 1
        const discountAmount = (price * quantity * discountPercent) / 100
        const total = (item.SumPrice || price * quantity) - discountAmount

        return {
          row: idx + 1,
          code: item.ProductErpCode,
          name: item.ProductName || `محصول ${item.ProductErpCode}`,
          quantity,
          unit_price: price,
          discount_percent: discountPercent,
          discount_amount: discountAmount,
          total,
        }
      })

      setSelectedInvoice({
        id: invoice.id,
        invoice_number: invoice.invoice_number, // عددی
        date: invoice.date,
        customer_name: invoice.customer_name,
        customer_id: invoice.customer_id,
        details,
        status: invoice.status,
        sumPrice: invoiceData.SumPrice,
      })
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Error fetching invoice details:", error)
      toast.error("خطا در بارگیری جزئیات فاکتور")
    }
  }

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8">در حال بارگیری...</div>
          ) : allInvoices.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">لیست فاکتورها</h3>
              <p>هنوز فاکتوری ثبت نشده است</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">لیست فاکتورها</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 border">کد فاکتور</th>
                      <th className="p-2 border">تاریخ</th>
                      <th className="p-2 border">مشتری</th>
                      <th className="p-2 border">مبلغ (ریال)</th>
                      <th className="p-2 border">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/50">
                        <td className="p-2 border text-center">{invoice.invoice_number}</td>
                        <td className="p-2 border text-center">{invoice.date}</td>
                        <td className="p-2 border text-center">{invoice.customer_name}</td>
                        <td className="p-2 border text-center">
                          {invoice.rialTotal && invoice.rialTotal > 0
                            ? formatCurrency(invoice.rialTotal)
                            : "-"}
                        </td>
                        <td className="p-2 border text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice.id)}>
                            <FiEye className="h-4 w-4" />
                          </Button>
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
                    نمایش {invoices.length} از {allInvoices.length} فاکتور
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

      {isDialogOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-2 p-4 relative">
            <button
              className="absolute left-2 top-2 text-gray-500 hover:text-red-600"
              onClick={() => setIsDialogOpen(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-2">جزییات فاکتور</h2>
            <div className="mb-2 text-sm text-muted-foreground">
              <span>کد فاکتور: {selectedInvoice.invoice_number}</span>
              <span className="mx-2">|</span>
              <span>تاریخ: {selectedInvoice.date}</span>
              <span className="mx-2">|</span>
              <span>مشتری: {selectedInvoice.customer_name}</span>
            </div>
            <div className="hidden md:block">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 border">ردیف</th>
                    <th className="p-2 border">کد محصول</th>
                    <th className="p-2 border">نام محصول</th>
                    <th className="p-2 border">تعداد</th>
                    <th className="p-2 border">قیمت واحد</th>
                    <th className="p-2 border">تخفیف</th>
                    <th className="p-2 border">قیمت کل</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.details.map((item: any) => (
                    <tr key={item.row} className="border-b">
                      <td className="p-2 border text-center">{item.row}</td>
                      <td className="p-2 border text-center">{item.code}</td>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border text-center">{item.quantity}</td>
                      <td className="p-2 border text-center">{formatCurrency(item.unit_price)}</td>
                      <td className="p-2 border text-center">
                        {item.discount_percent ? `${item.discount_percent}%` : "-"}
                      </td>
                      <td className="p-2 border text-center">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden flex flex-col gap-3">
              {selectedInvoice.details.map((item: any) => (
                <div key={item.row} className="border rounded p-3 bg-muted/30 flex flex-col gap-1 w-full">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>ردیف: {item.row}</span>
                    <span>کد: {item.code}</span>
                  </div>
                  <div className="font-medium">{item.name}</div>
                  <div className="flex flex-wrap gap-2 text-sm mt-1">
                    <span>تعداد: {item.quantity}</span>
                    <span>قیمت واحد: {formatCurrency(item.unit_price)}</span>
                    <span>تخفیف: {item.discount_percent ? `${item.discount_percent}%` : "-"}</span>
                    <span>قیمت کل: {formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-left font-bold">
              جمع کل: {formatCurrency(selectedInvoice.sumPrice)} ریال
            </div>
            <div className="mt-2 text-left font-medium text-green-700">
              جمع کل تخفیف:{" "}
              {formatCurrency(
                selectedInvoice.details.reduce(
                  (sum: number, item: any) =>
                    sum +
                    ((item.unit_price * item.quantity * (item.discount_percent || 0)) / 100),
                  0
                )
              )}{" "}
              ریال
            </div>
          </div>
        </div>
      )}
    </>
  )
})

InvoiceList.displayName = "InvoiceList"

export default InvoiceList