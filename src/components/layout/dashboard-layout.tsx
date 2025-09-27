"use client"

import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { useState } from "react"
import {
  FiChevronDown,
  FiChevronLeft,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPackage,
  FiShoppingCart,
  FiSun,
  FiUsers,
  FiX,
} from "react-icons/fi"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active: boolean
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
      active
        ? "bg-primary text-primary-foreground font-medium"
        : "hover:bg-accent text-muted-foreground hover:text-foreground",
    )}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </Link>
)

interface SidebarDropdownProps {
  icon: React.ReactNode
  label: string
  items: Array<{
    name: string
    href: string
    icon: React.ReactNode
  }>
  pathname: string
}

const SidebarDropdown = ({ icon, label, items, pathname }: SidebarDropdownProps) => {
  const [isOpen, setIsOpen] = useState(() => {
    return items.some((item) => pathname.startsWith(item.href))
  })

  const hasActiveChild = items.some((item) => pathname === item.href)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors",
          hasActiveChild
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-accent text-muted-foreground hover:text-foreground",
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </div>
        {isOpen ? <FiChevronDown size={16} /> : <FiChevronLeft size={16} />}
      </button>
      {isOpen && (
        <div className="mr-4 mt-1 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm",
                pathname === item.href
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-accent text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add("dark-theme")
    } else {
      document.documentElement.classList.remove("dark-theme")
    }
  }

  const navigation = [
    {
      name: "داشبورد",
      href: "/dashboard",
      icon: <FiHome />,
    },
  ]

  const salesItems = [
    {
      name: "پیش فاکتورها",
      href: "/invoices",
      icon: <FiFileText />,
    },
    {
      name: "فاکتورها",
      href: "/sales",
      icon: <FiFileText />,
    },
  ]

  const otherNavigation = [
    {
      name: "مشتریان",
      href: "/customers",
      icon: <FiUsers />,
    },
    {
      name: "محصولات",
      href: "/products",
      icon: <FiPackage />,
    },
  ]

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleBackdropClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  const getPageTitle = () => {
    const allItems = [...navigation, ...salesItems, ...otherNavigation]

    const currentItem = allItems.find((item) => item.href === pathname)
    if (currentItem) return currentItem.name

    if (pathname.startsWith("/invoices") || pathname.startsWith("/sales")) {
      return "فروش"
    }

    return ""
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={handleBackdropClick} aria-hidden="true" />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-64 transform overflow-y-auto border-l bg-card px-4 py-5 shadow-lg transition-transform duration-200 ease-in-out md:w-72 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-foreground">حسابداری ایواسنس</h1>
          <button
            onClick={toggleSidebar}
            className="block rounded p-1 text-foreground hover:bg-muted lg:hidden"
            aria-label="بستن منو"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              label={item.name}
              href={item.href}
              active={pathname === item.href}
            />
          ))}

          <SidebarDropdown icon={<FiShoppingCart />} label="فروش" items={salesItems} pathname={pathname} />

          {otherNavigation.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              label={item.name}
              href={item.href}
              active={pathname === item.href}
            />
          ))}

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="text-xl">
              <FiLogOut />
            </span>
            <span>خروج</span>
          </button>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 sm:h-16 items-center justify-between border-b bg-card px-3 sm:px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="rounded p-1 text-foreground hover:bg-muted lg:hidden"
              aria-label="باز کردن منو"
            >
              <FiMenu size={24} />
            </button>
            <h2 className="text-base sm:text-lg font-medium text-foreground truncate max-w-[150px] sm:max-w-full">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-foreground hover:bg-muted transition-colors"
              aria-label={isDarkMode ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <div className="text-sm text-muted-foreground hidden sm:block">{user?.name || ""}</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-3 sm:p-4">
          <div className="container mx-auto py-2 sm:py-4">{children}</div>
        </main>
      </div>
    </div>
  )
}
