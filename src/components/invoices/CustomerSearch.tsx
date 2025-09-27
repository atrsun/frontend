import { Input } from "@/components/ui/input";
import { UserCustomer } from "@/lib/api/customerService";
import React, { useEffect } from "react";
import { FiLoader } from "react-icons/fi";

interface CustomerSearchProps {
  customerSearchTerm: string;
  setCustomerSearchTerm: (term: string) => void;
  isSearchingCustomer: boolean;
  searchedCustomers: UserCustomer[];
  selectCustomer: (customer: UserCustomer) => void;
  selectedCustomer: {
    customer_id: string;
    customer_name: string;
  };
}

export default function CustomerSearch({
  customerSearchTerm,
  setCustomerSearchTerm,
  isSearchingCustomer,
  searchedCustomers,
  selectCustomer,
  selectedCustomer,
}: CustomerSearchProps) {
  const handleCustomerSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Debug: Log customer data when it changes
  useEffect(() => {
    console.log("CustomerSearch: searchedCustomers updated", searchedCustomers);
  }, [searchedCustomers]);

  return (
    <div className="mb-4 p-3 border rounded">
      <h4 className="text-sm font-medium mb-2">جستجوی مشتری</h4>
      <div className="flex gap-2">
        <Input
          placeholder="نام مشتری را وارد کنید..."
          value={customerSearchTerm}
          onChange={(e) => setCustomerSearchTerm(e.target.value)}
          onKeyDown={handleCustomerSearchKeyDown}
          className="flex-1"
        />
        {isSearchingCustomer && (
          <div className="flex items-center px-2">
            <FiLoader className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>

      {searchedCustomers.length > 0 && (
        <div className="mt-2 border rounded max-h-60 overflow-y-auto">
          {searchedCustomers.map((customer) => (
            <div
              key={customer.ErpCode}
              className="p-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
              onClick={() => {
                console.log("Selecting customer:", customer);
                selectCustomer(customer);
              }}
            >
              <div className="font-medium">{customer.Name || "بدون نام"}</div>
              {customer.Mobile && (
                <div className="text-sm text-muted-foreground">
                  شماره تماس: {customer.Mobile}
                </div>
              )}
              {customer.City && (
                <div className="text-sm text-muted-foreground">
                  شهر: {customer.City}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                کد: {customer.ErpCode}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCustomer.customer_id && (
        <div className="mt-2 p-2 border rounded bg-muted">
          <div className="font-medium">
            مشتری انتخاب شده: {selectedCustomer.customer_name}
          </div>
          <div className="text-sm text-muted-foreground">
            کد: {selectedCustomer.customer_id}
          </div>
        </div>
      )}
    </div>
  );
}
