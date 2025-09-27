export interface InvoiceItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: InvoiceItem[];
}

export const invoices: Invoice[] = [
  {
    id: "inv-001",
    customerId: "c1",
    date: "2023-10-05",
    dueDate: "2023-10-19",
    status: "paid",
    subtotal: 530000,
    tax: 53000,
    discount: 0,
    total: 583000,
    items: [
      {
        id: "item-001",
        productId: "p1",
        quantity: 2,
        price: 180000,
        discount: 0,
        total: 360000,
      },
      {
        id: "item-002",
        productId: "p4",
        quantity: 1,
        price: 120000,
        discount: 0,
        total: 120000,
      },
      {
        id: "item-003",
        productId: "p5",
        quantity: 1,
        price: 150000,
        discount: 20000,
        total: 130000,
      },
    ],
  },
  {
    id: "inv-002",
    customerId: "c3",
    date: "2023-11-10",
    dueDate: "2023-11-24",
    status: "paid",
    subtotal: 800000,
    tax: 80000,
    discount: 50000,
    total: 830000,
    items: [
      {
        id: "item-004",
        productId: "p2",
        quantity: 2,
        price: 350000,
        discount: 50000,
        total: 650000,
      },
      {
        id: "item-005",
        productId: "p10",
        quantity: 1,
        price: 220000,
        discount: 0,
        total: 220000,
      },
    ],
  },
  {
    id: "inv-003",
    customerId: "c5",
    date: "2023-12-15",
    dueDate: "2023-12-29",
    status: "pending",
    subtotal: 640000,
    tax: 64000,
    discount: 0,
    total: 704000,
    items: [
      {
        id: "item-006",
        productId: "p3",
        quantity: 1,
        price: 250000,
        discount: 0,
        total: 250000,
      },
      {
        id: "item-007",
        productId: "p6",
        quantity: 1,
        price: 200000,
        discount: 0,
        total: 200000,
      },
      {
        id: "item-008",
        productId: "p8",
        quantity: 1,
        price: 180000,
        discount: 0,
        total: 180000,
      },
    ],
  },
  {
    id: "inv-004",
    customerId: "c2",
    date: "2024-01-08",
    dueDate: "2024-01-22",
    status: "paid",
    subtotal: 450000,
    tax: 45000,
    discount: 0,
    total: 495000,
    items: [
      {
        id: "item-009",
        productId: "p7",
        quantity: 1,
        price: 450000,
        discount: 0,
        total: 450000,
      },
    ],
  },
  {
    id: "inv-005",
    customerId: "c9",
    date: "2024-01-20",
    dueDate: "2024-02-03",
    status: "overdue",
    subtotal: 630000,
    tax: 63000,
    discount: 50000,
    total: 643000,
    items: [
      {
        id: "item-010",
        productId: "p9",
        quantity: 1,
        price: 280000,
        discount: 0,
        total: 280000,
      },
      {
        id: "item-011",
        productId: "p1",
        quantity: 1,
        price: 180000,
        discount: 0,
        total: 180000,
      },
      {
        id: "item-012",
        productId: "p4",
        quantity: 1,
        price: 120000,
        discount: 0,
        total: 120000,
      },
      {
        id: "item-013",
        productId: "p5",
        quantity: 1,
        price: 150000,
        discount: 50000,
        total: 100000,
      },
    ],
  },
];
