import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CART_COOKIE_NAME = 'art-cart';

async function clearCart() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

export async function POST() {
  try {
    await clearCart();
    return NextResponse.json({ success: true, message: 'Checkout successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to checkout' }, { status: 500 });
  }
}
