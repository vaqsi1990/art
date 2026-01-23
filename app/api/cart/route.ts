import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Artwork, getArtworkById } from '@/data/artworks';

export interface CartItem extends Artwork {
  quantity: number;
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

export async function GET() {
  try {
    const cart = await getCartFromCookies();
    return NextResponse.json({ cart, totalItems: cart.reduce((sum, item) => sum + item.quantity, 0) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get cart' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const artwork = getArtworkById(id);
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const cart = await getCartFromCookies();
    const existingItem = cart.find((item) => item.id === id);

    let updatedCart: CartItem[];
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...artwork, quantity: 1 }];
    }

    await saveCartToCookies(updatedCart);

    return NextResponse.json({
      cart: updatedCart,
      totalItems: updatedCart.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}
