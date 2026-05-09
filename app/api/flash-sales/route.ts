import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.flashSales || []);
}

export async function POST(request: Request) {
  const db = readDb();
  const body = await request.json();
  const newFlashSale = {
    id: Date.now(),
    ...body,
    status: 'scheduled',
    revenue: 0,
    orders: 0
  };
  if (!db.flashSales) db.flashSales = [];
  db.flashSales.push(newFlashSale);
  writeDb(db);
  return NextResponse.json(newFlashSale, { status: 201 });
}

export async function DELETE(request: Request) {
  const db = readDb();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  db.flashSales = (db.flashSales || []).filter((s: any) => s.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
