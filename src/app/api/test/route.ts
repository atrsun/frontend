import { NextResponse } from 'next/server';
import { testApiConnection, testLoginEndpoint } from '@/lib/api/testConnection';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://holoo.evasence.ir';
    
    // Test the API connection
    const connectionTest = await testApiConnection(apiUrl);
    
    // Test the login endpoint
    const loginTest = await testLoginEndpoint(apiUrl);
    
    return NextResponse.json({
      apiUrl,
      connectionTest,
      loginTest,
    });
  } catch (error: any) {
    console.error('API test failed:', error);
    
    return NextResponse.json({
      error: 'API test failed',
      message: error.message,
    }, { status: 500 });
  }
} 