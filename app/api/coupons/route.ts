import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.coupons || []);
}

export async function POST(request: Request) {
  const db = readDb();
  const body = await request.json();
  const newCoupon = {
    id: Date.now(),
    ...body,
    used: 0,
    status: 'active',
    revenue: 0,
  };
  if (!db.coupons) db.coupons = [];
  db.coupons.push(newCoupon);
  writeDb(db);
  return NextResponse.json(newCoupon, { status: 201 });
}

export async function PUT(request: Request) {
  const db = readDb();
  const body = await request.json();
  const index = (db.coupons || []).findIndex((c: any) => c.id === body.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  db.coupons[index] = { ...db.coupons[index], ...body };
  writeDb(db);
  return NextResponse.json(db.coupons[index]);
}

export async function DELETE(request: Request) {
  const db = readDb();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  db.coupons = (db.coupons || []).filter((c: any) => c.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
