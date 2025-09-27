import React from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface InvoiceSummaryProps {
  totals: {
    rialSubtotal: number;
    usdSubtotal: number;
    rialTotal: number;
    usdTotal: number;
    totalDiscount: number;
  };
  isSaving: boolean;
  createInvoice: () => void;
}

export default function InvoiceSummary({
  totals,
  isSaving,
  createInvoice,
}: InvoiceSummaryProps) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-start gap-4 border-t pt-4">
      <div>
        <Button
          variant="default"
          onClick={createInvoice}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? "در حال ذخیره..." : "ثبت پیش فاکتور"}
        </Button>
      </div>
      <div className="space-y-2 text-center sm:text-left mb-2 sm:mb-0">
        {totals.rialSubtotal > 0 && (
          <div className="text-sm">
            جمع کل (ریال):{" "}
            <span className="font-bold">
              {formatCurrency(totals.rialSubtotal)}
            </span>
          </div>
        )}
        {totals.usdSubtotal > 0 && (
          <div className="text-sm">
            جمع کل (دلار):{" "}
            <span className="font-bold">
              {totals.usdSubtotal} USD
            </span>
          </div>
        )}
        {totals.totalDiscount > 0 && (
          <div className="text-sm text-red-600">
            مجموع تخفیف:{" "}
            <span className="font-bold">
              {formatCurrency(totals.totalDiscount)}
            </span>
          </div>
        )}
        {totals.rialTotal > 0 && (
          <div className="text-base font-bold">
            مبلغ نهایی (ریال):{" "}
            <span>{formatCurrency(totals.rialTotal)}</span>
          </div>
        )}
        {totals.usdTotal > 0 && (
          <div className="text-base font-bold">
            مبلغ نهایی (دلار):{" "}
            <span>{totals.usdTotal} USD</span>
          </div>
        )}
      </div>
    </div>
  );
} 