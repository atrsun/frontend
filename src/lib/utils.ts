import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a Persian currency (Rial)
 */
export function formatCurrency(amount: number, isUSD?: boolean): string {

  
  const formattedNumber = new Intl.NumberFormat("fa-IR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  
  // Return with proper RTL/LTR handling
  return `${formattedNumber} ${isUSD ? "$" : "ریال"}`;
}

/**
 * Formats a date string to Persian date format
 */
export function formatPersianDate(dateInput: string | Date) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit", // ماه عددی
    day: "2-digit",
  }).format(date);
}

/**
 * Finds a product by ID in the products array
 */
export function findProductById(products: any[], id: string) {
  return products.find(product => product.id === id);
}

/**
 * Finds a customer by ID in the customers array
 */
export function findCustomerById(customers: any[], id: string) {
  return customers.find(customer => customer.id === id);
}

/**
 * Generates a random ID with a given prefix
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Truncates a string to a given length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Returns a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Returns a date X days from today in YYYY-MM-DD format
 */
export function getDateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}