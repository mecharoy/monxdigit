import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // This will test the database connection
    await prisma.$connect()

    return NextResponse.json({
      success: true,
      message: 'Database connected! The contact form should work now.'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Database not connected. Please set DATABASE_URL in Vercel environment variables.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
