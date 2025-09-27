export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalSpent: number;
}

export const customers: Customer[] = [
  {
    id: "c1",
    name: "مریم رضایی",
    email: "maryam.rezaei@gmail.com",
    phone: "09123456789",
    address: "تهران، خیابان ولیعصر، پلاک ۲۴۵",
    joinDate: "2023-02-15",
    totalSpent: 1250000
  },
  {
    id: "c2",
    name: "علی محمدی",
    email: "ali.mohammadi@yahoo.com",
    phone: "09187654321",
    address: "اصفهان، خیابان چهارباغ، کوچه گلها، پلاک ۱۲",
    joinDate: "2023-04-20",
    totalSpent: 870000
  },
  {
    id: "c3",
    name: "نیلوفر کریمی",
    email: "niloofar.karimi@gmail.com",
    phone: "09361234567",
    address: "شیراز، بلوار زند، کوچه ۷، پلاک ۳۰",
    joinDate: "2023-05-10",
    totalSpent: 2100000
  },
  {
    id: "c4",
    name: "محمد حسینی",
    email: "mohammad.hosseini@gmail.com",
    phone: "09121112233",
    address: "مشهد، بلوار وکیل آباد، پلاک ۷۸",
    joinDate: "2023-01-05",
    totalSpent: 560000
  },
  {
    id: "c5",
    name: "سارا اکبری",
    email: "sara.akbari@yahoo.com",
    phone: "09354445566",
    address: "تبریز، خیابان امام، کوچه بهار، پلاک ۵۵",
    joinDate: "2023-03-12",
    totalSpent: 1450000
  },
  {
    id: "c6",
    name: "رضا قاسمی",
    email: "reza.ghasemi@gmail.com",
    phone: "09127778899",
    address: "کرج، بلوار دانش آموز، پلاک ۱۱۰",
    joinDate: "2023-06-25",
    totalSpent: 720000
  },
  {
    id: "c7",
    name: "فاطمه احمدی",
    email: "fatemeh.ahmadi@yahoo.com",
    phone: "09363333444",
    address: "قم، خیابان انقلاب، کوچه فردوسی، پلاک ۶",
    joinDate: "2023-02-28",
    totalSpent: 950000
  },
  {
    id: "c8",
    name: "امیر جعفری",
    email: "amir.jafari@gmail.com",
    phone: "09128889900",
    address: "یزد، خیابان فرهنگ، کوچه ۱۵، پلاک ۴۱",
    joinDate: "2023-07-08",
    totalSpent: 640000
  },
  {
    id: "c9",
    name: "زهرا میرزایی",
    email: "zahra.mirzaei@yahoo.com",
    phone: "09352223344",
    address: "رشت، خیابان گلسار، کوچه نسترن، پلاک ۲۳",
    joinDate: "2023-04-15",
    totalSpent: 1830000
  },
  {
    id: "c10",
    name: "حسین صادقی",
    email: "hossein.sadeghi@gmail.com",
    phone: "09126667788",
    address: "کرمان، خیابان شریعتی، کوچه سعدی، پلاک ۳۷",
    joinDate: "2023-03-05",
    totalSpent: 1120000
  }
]; 