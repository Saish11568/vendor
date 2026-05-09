import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.products);
}

export async function POST(request: Request) {
  const data = await request.json();
  const db = readDb();
  const newProduct = {
    ...data,
    id: Date.now(),
    vendor: data.vendor || "Nexa Vendor",
    rating: data.rating || 4.5,
    reviews: data.reviews || 0,
    status: data.status || "active",
  };
  db.products.push(newProduct);

  // Also log a notification event for the customer side
  if (!db.notifications) db.notifications = [];
  db.notifications.push({
    id: Date.now().toString(),
    title: "New Product Available!",
    message: `${newProduct.name} has been added to the marketplace by ${newProduct.vendor}`,
    time: new Date().toISOString(),
    type: "promo",
    read: false,
  });

  writeDb(db);
  return NextResponse.json(newProduct, { status: 201 });
}
