import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const CASHFREE_BASE = (process.env.CASHFREE_ENV || 'sandbox') === 'production'
  ? 'https://api.cashfree.com'
  : 'https://sandbox.cashfree.com';
const CASHFREE_RETURN_URL = process.env.CASHFREE_RETURN_URL || 'http://localhost:5173/success?order_id={order_id}';

function getAuthHeaders() {
  const appId = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET;
  if (!appId || !secret) {
    throw new Error('Cashfree credentials missing');
  }
  return {
    'x-client-id': appId,
    'x-client-secret': secret,
    'x-api-version': '2022-09-01',
    'Content-Type': 'application/json'
  };
}

// In-memory demo users store (for demo purposes only)
const users = new Map();

// Auth: Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const normalizedEmail = String(email).toLowerCase();
    if (users.has(normalizedEmail)) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const user = {
      id: `u_${Date.now()}`,
      name,
      email: normalizedEmail,
      password, // NOTE: Plain text only for demo. Do NOT do this in production.
      phone: phone || '9999999999',
      createdAt: new Date().toISOString()
    };
    users.set(normalizedEmail, user);
    const fakeToken = `demo-token-${user.id}`;
    return res.json({ success: true, token: fakeToken, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing email or password' });
    }
    const normalizedEmail = String(email).toLowerCase();
    const user = users.get(normalizedEmail);
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const fakeToken = `demo-token-${user.id}`;
    return res.json({ success: true, token: fakeToken, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { customer_id, customer_name, customer_email, customer_phone, amount } = req.body || {};

    const orderId = `order_${Date.now()}`;
    const payload = {
      order_id: orderId,
      order_amount: Number(amount) > 0 ? Number(amount) : 300,
      order_currency: 'INR',
      customer_details: {
        customer_id: customer_id || `cust_${Date.now()}`,
        customer_name: customer_name || 'Customer',
        customer_email: customer_email || 'customer@example.com',
        customer_phone: customer_phone || '9999999999'
      },
      order_meta: {
        return_url: 'https://qirpl.icarerobotics.com/web/index.html?order_id={order_id}',
        notify_url: ''
      }
    };

    const headers = getAuthHeaders();
    const { data } = await axios.post(
      `${CASHFREE_BASE}/pg/orders`,
      payload,
      { headers }
    );

    res.json({
      success: true,
      order: data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.response?.data || err.message });
  }
});

app.get('/api/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const headers = getAuthHeaders();
    const { data } = await axios.get(
      `${CASHFREE_BASE}/pg/orders/${orderId}`,
      { headers }
    );
    res.json({ success: true, order: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.response?.data || err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


