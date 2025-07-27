import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    adminKey: process.env.ADMIN_KEY || 'NOT_SET',
    expectedKey: process.env.ADMIN_KEY ? 'SET' : 'NOT_SET',
    fallbackKey: 'kala-admin-2024',
    environment: process.env.NODE_ENV,
    message: 'Use this key in your admin requests'
  });
}
