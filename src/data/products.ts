export interface Product {
  id: string;
  name: string;
  persianName: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  code?: string;
  other1?: string;
  other2?: string;
  isActive?: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Rose Water Face Toner",
    persianName: "تونر صورت گلاب",
    category: "skincare",
    price: 180000,
    stock: 45,
    image: "/products/rose-water.jpg",
    description: "تونر طبیعی گلاب برای پوست‌های حساس با خاصیت آبرسانی و شاداب کننده"
  },
  {
    id: "p2",
    name: "Persian Saffron Face Cream",
    persianName: "کرم صورت زعفران",
    category: "skincare",
    price: 350000,
    stock: 20,
    image: "/products/saffron-cream.jpg",
    description: "کرم صورت با عصاره زعفران ایرانی برای روشن شدن و جوانسازی پوست"
  },
  {
    id: "p3",
    name: "Argan Oil Hair Serum",
    persianName: "سرم مو روغن آرگان",
    category: "haircare",
    price: 250000,
    stock: 30,
    image: "/products/argan-oil.jpg",
    description: "سرم مرطوب کننده و ترمیم کننده مو با روغن آرگان خالص"
  },
  {
    id: "p4",
    name: "Pomegranate Lip Balm",
    persianName: "بالم لب انار",
    category: "lip care",
    price: 120000,
    stock: 60,
    image: "/products/pomegranate-balm.jpg",
    description: "بالم لب با عصاره انار برای لب‌های نرم و مرطوب"
  },
  {
    id: "p5",
    name: "Pistachio Hand Cream",
    persianName: "کرم دست پسته",
    category: "body care",
    price: 150000,
    stock: 40,
    image: "/products/pistachio-cream.jpg",
    description: "کرم دست با روغن پسته ایرانی برای پوست دست‌های خشک و آسیب دیده"
  },
  {
    id: "p6",
    name: "Natural Almond Face Scrub",
    persianName: "اسکراب صورت بادام طبیعی",
    category: "skincare",
    price: 200000,
    stock: 25,
    image: "/products/almond-scrub.jpg",
    description: "اسکراب صورت با پودر بادام برای لایه برداری ملایم و روشن کننده پوست"
  },
  {
    id: "p7",
    name: "Damask Rose Perfume",
    persianName: "عطر گل محمدی",
    category: "fragrance",
    price: 450000,
    stock: 15,
    image: "/products/rose-perfume.jpg",
    description: "عطر با رایحه گل محمدی دمشق برای بانوان با ماندگاری بالا"
  },
  {
    id: "p8",
    name: "Organic Henna Hair Color",
    persianName: "رنگ مو حنا ارگانیک",
    category: "haircare",
    price: 180000,
    stock: 35,
    image: "/products/henna-color.jpg",
    description: "رنگ موی طبیعی با حنای ارگانیک بدون آمونیاک و مواد شیمیایی مضر"
  },
  {
    id: "p9",
    name: "Persian Walnut Body Oil",
    persianName: "روغن بدن گردو",
    category: "body care",
    price: 280000,
    stock: 22,
    image: "/products/walnut-oil.jpg",
    description: "روغن بدن با خاصیت مرطوب کنندگی عمیق و سرشار از ویتامین E"
  },
  {
    id: "p10",
    name: "Sandalwood Beard Oil",
    persianName: "روغن ریش صندل",
    category: "men's care",
    price: 220000,
    stock: 28,
    image: "/products/beard-oil.jpg",
    description: "روغن ریش با رایحه صندل برای آقایان با خاصیت نرم کنندگی و براق کننده"
  }
]; 