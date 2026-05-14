const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Demo in-memory products store. Replace with real DB in production.
const products = [
  { id: 'p1', title: 'Handmade Lamp', price_cents: 4999, currency: 'USD', image: '/images/lamp.jpg', stock: 10 },
  { id: 'p2', title: 'Stylish Hoodie', price_cents: 2999, currency: 'USD', image: '/images/hoodie.jpg', stock: 25 },
  { id: 'p3', title: 'Wireless Earbuds', price_cents: 7999, currency: 'USD', image: '/images/earbuds.jpg', stock: 8 }
];

// Simple GET /products
router.get('/products', (req, res) => {
  res.json(products);
});

// GET /products/:id
router.get('/products/:id', (req, res) => {
  const p = products.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

// POST /orders - demo order creation (in-memory)
const orders = [];
router.post('/orders', (req, res) => {
  const { productId, quantity = 1, buyer } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(400).json({ error: 'Invalid product' });
  if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

  // reduce stock (demo only)
  product.stock -= quantity;

  const order = {
    id: uuidv4(),
    productId,
    quantity,
    buyer: buyer || { name: 'guest' },
    status: 'created',
    created_at: new Date().toISOString()
  };
  orders.push(order);
  // In real world: create idempotency keys and persist to DB, call payment gateway, handle webhooks.
  res.status(201).json(order);
});

module.exports = { router, products, orders };
