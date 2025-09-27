import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    // Get the current session
    const session = await getSession();
    
    // If the user is logged in, return the user data
    if (session.isLoggedIn && session.user) {
      return NextResponse.json({
        isLoggedIn: true,
        user: session.user
      });
    }
    
    // Otherwise, return not logged in
    return NextResponse.json({
      isLoggedIn: false
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'An error occurred while retrieving the session' },
      { status: 500 }
    );
  }
} 