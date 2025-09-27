"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/forms/form";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("ایمیل نامعتبر است").min(1, "ایمیل الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    await login(data.email, data.password);
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4'>
      <Card className='w-full max-w-md border-none shadow-lg'>
        <CardHeader className='space-y-1 text-center pb-4 border-b'>
          <CardTitle className='text-2xl font-bold text-primary'>
            ورود به سیستم
          </CardTitle>
          <CardDescription className='text-gray-600'>
            برای ورود به داشبورد، اطلاعات خود را وارد کنید
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          {error && (
            <div className='bg-destructive/15 text-destructive text-sm p-4 rounded-lg mb-6 border border-destructive/30'>
              <p className='font-semibold'>خطا در ورود:</p>
              <p>{error}</p>
              {process.env.NODE_ENV === "development" && (
                <p className='mt-2 text-xs opacity-80'>
                  اگر با خطای Cannot POST /api/login مواجه شدید، ممکن است آدرس
                  API اشتباه باشد. لطفاً فایل .env یا .env.local را بررسی کرده و
                  مطمئن شوید که NEXT_PUBLIC_API_URL به درستی تنظیم شده است.
                </p>
              )}
            </div>
          )}

          <Form
            form={form}
            onSubmit={onSubmit}
          >
            <div className='space-y-5'>
              <FormField
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>ایمیل</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='ایمیل خود را وارد کنید'
                        {...field}
                        disabled={isLoading}
                        className='h-11 focus:ring-2 focus:ring-primary/20'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-700'>رمز عبور</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder='رمز عبور خود را وارد کنید'
                          {...field}
                          disabled={isLoading}
                          className='h-11 focus:ring-2 focus:ring-primary/20 pr-4 pl-10'
                        />
                        <button
                          type='button'
                          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors'
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={
                            showPassword
                              ? "پنهان کردن رمز عبور"
                              : "نمایش رمز عبور"
                          }
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full h-11 text-base font-medium'
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    در حال ورود...
                  </span>
                ) : (
                  <span className='flex items-center justify-center'>ورود</span>
                )}
              </Button>
            </div>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-center border-t pt-4 text-sm text-gray-500'>
          © {new Date().getFullYear()} اواسنس - تمامی حقوق محفوظ است
        </CardFooter>
      </Card>
    </div>
  );
}
