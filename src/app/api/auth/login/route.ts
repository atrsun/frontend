import { NextResponse } from 'next/server';
import { saveSession } from '@/lib/session';
import { authService } from '@/lib/api';
import { SessionData } from '@/lib/sessionConfig';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Call the authentication service
      const authResponse = await authService.login({ email, password });
      // Create session data
      const session: SessionData = {
        user: authResponse.user,
        token: authResponse.token.accessToken,
        isLoggedIn: true,
      };
      
      // Save the session and get the response with the cookie
      const sessionResponse = await saveSession(session);
      
      // Copy the Set-Cookie header to our response
      const response = NextResponse.json({
        success: true,
        user: authResponse.user
      });
      
      response.headers.set('Set-Cookie', sessionResponse.headers.get('Set-Cookie') || '');
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle demo login for development
      if (process.env.NODE_ENV === 'development' && 
          email === 'admin@example.com' && 
          password === 'admin123') {
        
        const mockUser = {
          id: 1,
          name: 'مدیر سیستم',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        // Create session data
        const session: SessionData = {
          user: mockUser,
          token: 'mock-token-for-demo',
          isLoggedIn: true,
        };
        
        // Save the session and get the response with the cookie
        const sessionResponse = await saveSession(session);
        
        // Copy the Set-Cookie header to our response
        const response = NextResponse.json({
          success: true,
          user: mockUser
        });
        
        response.headers.set('Set-Cookie', sessionResponse.headers.get('Set-Cookie') || '');
        
        return response;
      }
      
      // Extract error message from response if available
      let errorMessage = 'نام کاربری یا رمز عبور اشتباه است';
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.status === 404) {
          errorMessage = 'آدرس API نامعتبر است. لطفا با پشتیبانی تماس بگیرید.';
        }
      } else if (error.request) {
        errorMessage = 'سرور پاسخگو نیست. لطفا اتصال اینترنت خود را بررسی کنید.';
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 