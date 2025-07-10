import { NextResponse } from 'next/server';
import { getMostViewedCategories } from '../../../utils/analytics';

export async function GET() {
  try {
    // Get the 4 most viewed categories
    const popularCategories = await getMostViewedCategories(4);

    return NextResponse.json({ 
      success: true, 
      categories: popularCategories 
    });
  } catch (error) {
    console.error('Error getting popular categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get popular categories' },
      { status: 500 }
    );
  }
}
