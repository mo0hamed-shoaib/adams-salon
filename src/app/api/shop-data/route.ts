import { NextRequest, NextResponse } from 'next/server';
import { getShopData } from '@/lib/data';

export async function GET() {
  try {
    const shopData = getShopData();
    return NextResponse.json(shopData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch shop data' },
      { status: 500 }
    );
  }
}
