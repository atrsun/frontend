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
      console.log('Login attempt failed: Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log(`Login attempt for email: ${email}`);

    try {
      // Call the authentication service
      const authResponse = await authService.login({ email, password });
      console.log(`Authentication successful for user: ${authResponse.user.id}`);
      
      // Create session data
      const session: SessionData = {
        user: authResponse.user,
        token: authResponse.token.accessToken,
        isLoggedIn: true,
      };
      
      // Save the session and get the response with the cookie
      const sessionResponse = await saveSession(session);
      console.log(`Session created successfully for user: ${session.user.id}`);
      
      // Copy the Set-Cookie header to our response
      const response = NextResponse.json({
        success: true,
        user: authResponse.user
      });
      
      response.headers.set('Set-Cookie', sessionResponse.headers.get('Set-Cookie') || '');
      console.log(`Login completed successfully for user: ${session.user.email}`);
      
      return response;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle demo login for development
      if (process.env.NODE_ENV === 'development' && 
          email === 'admin@example.com' && 
          password === 'admin123') {
        
        console.log('Demo login used for development');
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
        console.log('Demo session created successfully');
        
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
        console.log(`Authentication failed for ${email}: ${errorMessage}`);
      } else if (error.request) {
        errorMessage = 'سرور پاسخگو نیست. لطفا اتصال اینترنت خود را بررسی کنید.';
        console.log(`Network error during login for ${email}: Server not responding`);
      } else {
        console.log(`General error during login for ${email}: ${error.message}`);
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }
  } catch (error) {
    console.error('Server error in login handler:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}