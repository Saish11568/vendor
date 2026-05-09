import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const db = readDb();
    const id = Number(params.id);
    
    const index = db.products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    db.products[index] = { ...db.products[index], ...data, id };
    writeDb(db);
    return NextResponse.json(db.products[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = readDb();
    const id = Number(params.id);
    
    const index = db.products.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Also delete any variants, images, specs if they were in a separate table, but here they are embedded
    db.products.splice(index, 1);
    
    // Optional: Log a deletion notification
    if (!db.notifications) db.notifications = [];
    db.notifications.push({
      id: Date.now().toString(),
      title: "Product Removed",
      message: `A vendor has removed a product.`,
      time: new Date().toISOString(),
      type: "alert",
      read: false,
    });

    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
