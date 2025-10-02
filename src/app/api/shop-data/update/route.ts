import { NextRequest, NextResponse } from 'next/server';
import { updateShopData } from '@/lib/data';
import { ShopData } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, data } = body;

    // Verify password
    if (password !== process.env.DASHBOARD_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Update shop data
    const updatedData = updateShopData(data as Partial<ShopData>);
    
    return NextResponse.json({
      success: true,
      data: updatedData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update shop data' },
      { status: 500 }
    );
  }
}
