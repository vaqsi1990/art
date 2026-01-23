import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export interface CartItem {
  id: string;
  quantity: number;
  [key: string]: any;
}

const CART_COOKIE_NAME = 'art-cart';

async function getCartFromCookies(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);
  if (!cartCookie) return [];
  try {
    return JSON.parse(cartCookie.value);
  } catch {
    return [];
  }
}

async function saveCartToCookies(cart: CartItem[]) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cart = await getCartFromCookies();
    const updatedCart = cart.filter((item) => item.id !== id);
    await saveCartToCookies(updatedCart);

    return NextResponse.json({
      cart: updatedCart,
      totalItems: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const cart = await getCartFromCookies();

    if (quantity === 0) {
      // Remove item if quantity is 0
      const updatedCart = cart.filter((item) => item.id !== id);
      await saveCartToCookies(updatedCart);
      return NextResponse.json({
        cart: updatedCart,
        totalItems: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
      });
    }

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    // Check if item exists
    const itemExists = updatedCart.some((item) => item.id === id);
    if (!itemExists) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    await saveCartToCookies(updatedCart);

    return NextResponse.json({
      cart: updatedCart,
      totalItems: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}
