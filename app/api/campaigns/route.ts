import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
  const db = readDb();
  return NextResponse.json(db.campaigns || []);
}

export async function POST(request: Request) {
  const db = readDb();
  const body = await request.json();
  const newCampaign = {
    id: Date.now(),
    ...body,
    sent: 0,
    opened: 0,
    clicked: 0,
    status: 'active',
    revenue: 0,
    conversions: 0
  };
  if (!db.campaigns) db.campaigns = [];
  db.campaigns.push(newCampaign);
  writeDb(db);
  return NextResponse.json(newCampaign, { status: 201 });
}

export async function DELETE(request: Request) {
  const db = readDb();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  db.campaigns = (db.campaigns || []).filter((c: any) => c.id !== id);
  writeDb(db);
  return NextResponse.json({ success: true });
}
