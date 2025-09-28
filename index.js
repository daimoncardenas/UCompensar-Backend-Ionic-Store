/** @format */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'dev-secret-just-for-class';

const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); }
  catch { return fallback; }
}
async function writeJson(file, data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

// ---------- Auth ----------
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === 'demo@demo.com' && password === '1234567') {
    const token = jwt.sign({ sub: '123', email }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

function parseBearer(req) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return null;
  try { return jwt.verify(token, SECRET); } catch { return null; }
}

app.get('/me', (req, res) => {
  const user = parseBearer(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ id: Number(user.sub) || 123, email: user.email });
});

// ---------- Products (interfaces.Product) ----------
app.get('/products', async (_req, res) => {
  const products = await readJson(PRODUCTS_FILE, []);
  res.json(products);
});

app.get('/products/:id', async (req, res) => {
  const products = await readJson(PRODUCTS_FILE, []);
  const id = Number(req.params.id);
  const p = products.find(x => Number(x.id) === id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
});

// ---------- Orders (interfaces.Order / CreateOrderPayload) ----------
// GET /orders: if JWT present -> only that user, else all (simple for class)
app.get('/orders', async (req, res) => {
  const orders = await readJson(ORDERS_FILE, []);
  const user = parseBearer(req);
  if (user) {
    return res.json(orders.filter(o => Number(o.userId) === Number(user.sub)));
  }
  res.json(orders);
});

// POST /orders: { items: [{productId:number, qty:number}], shipping:{...} }
app.post('/orders', async (req, res) => {
  try {
    const { items, shipping } = req.body || {};
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ message: 'items[] required' });

    const products = await readJson(PRODUCTS_FILE, []);
    const orders = await readJson(ORDERS_FILE, []);

    // compute next numeric id
    const nextId = orders.length ? Math.max(...orders.map(o => Number(o.id))) + 1 : 1;

    // validate items and compute total
    let total = 0;
    const normalized = items.map(it => {
      const productId = Number(it.productId);
      const qty = Math.max(1, Number(it.qty) || 1);
      const p = products.find(x => Number(x.id) === productId);
      if (!p) throw new Error(`Product ${productId} not found`);
      total += p.price * qty;
      return { productId, qty, price: p.price, name: p.name };
    });

    const user = parseBearer(req);
    const order = {
      id: nextId,                              // number
      total: Number(total.toFixed(2)),         // number
      status: 'pending',                       // 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
      createdAt: new Date().toISOString(),     // string
      userId: user ? Number(user.sub) : null,  // extra metadata
      email: user ? user.email : null,
      items: normalized,                       // stored copy for reference
      shipping: shipping || null               // { name, address, city, country }
    };

    orders.unshift(order);
    await writeJson(ORDERS_FILE, orders);

    res.status(201).json({
      id: order.id,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Invalid order payload' });
  }
});

// ---------- Misc ----------
app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ message: `No route ${req.method} ${req.url}` }));

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
