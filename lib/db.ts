import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

export function readDb() {
  const defaultDb = { products: [], orders: [], notifications: [], customers: [], reviews: [] };
  if (!fs.existsSync(DB_FILE)) {
    return defaultDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      ...defaultDb,
      ...parsed,
      products: Array.isArray(parsed.products) ? parsed.products : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      customers: Array.isArray(parsed.customers) ? parsed.customers : [],
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    };
  } catch (e) {
    console.error("Error parsing db.json:", e);
    return defaultDb;
  }
}

export function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
