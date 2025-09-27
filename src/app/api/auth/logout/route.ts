import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';
import { defaultSession } from '@/lib/sessionConfig';
import { authService } from '@/lib/api';

export async function POST() {
  try {
    // Get the current session
    const session = await getSession();
    
    // If there's a token and it's not the mock token, call the logout API
    if (session.token && session.token !== 'mock-token-for-demo') {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Error calling logout API:', error);
        // Continue with local logout even if API call fails
      }
    }
    
    // Save the default (empty) session and get the response with the cookie
    const sessionResponse = await saveSession(defaultSession);
    
    // Copy the Set-Cookie header to our response
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', sessionResponse.headers.get('Set-Cookie') || '');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 