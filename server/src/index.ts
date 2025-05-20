import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../public')));

// Google Sheets API URL
const SHEETS_API_URL = process.env.SHEETS_API_URL || 'https://script.google.com/macros/s/AKfycbw2Rk-Xnr7KySNmB_jnla-RZkOa1gpRnBD-jYTPt9mJ8jdq__GuxNfsF_LKx0-JRPL1mw/exec';

// Product file path
const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'public', 'products.txt');

// User file path
const USERS_FILE_PATH = path.join(process.cwd(), 'public', 'users.txt');

// Ensure the products file exists and directory exists
const productsDir = path.dirname(PRODUCTS_FILE_PATH);
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}
if (!fs.existsSync(PRODUCTS_FILE_PATH)) {
  fs.writeFileSync(PRODUCTS_FILE_PATH, '[]');
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE_PATH)) {
  fs.writeFileSync(USERS_FILE_PATH, JSON.stringify([]));
}

// Routes
app.get('/api/orders', async (req, res) => {
  try {
    const response = await axios.get(`${SHEETS_API_URL}?action=getOrders`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = req.body;
    await axios.post(
      SHEETS_API_URL,
      qs.stringify({
        action: 'addOrder',
        data: JSON.stringify(order),
      })
    );
    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error adding order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isFulfilled } = req.body;

    await axios.post(SHEETS_API_URL, null, {
      params: {
        action: 'updateOrderStatus',
        data: JSON.stringify({ orderId, isFulfilled }),
      },
    }).catch(error => console.error('Error updating order status:', error.response?.data || error.message));

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.put('/api/orders/:orderId/paid', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isPaid } = req.body;

    await axios.post(SHEETS_API_URL, null, {
      params: {
        action: 'updatePaidStatus',
        data: JSON.stringify({ orderId, isPaid })
      }
    }).catch(error => console.error('Error updating order status:', error.response?.data || error.message));

    res.json({ message: 'Order paid updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});


app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = { ...req.body, id: orderId };

    await axios.post(SHEETS_API_URL, null, {
      params: {
        action: 'updateOrder',
        data: JSON.stringify(order),
      },
    }).catch(error => {
      console.error('Error updating order:', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to update order', details: error.response?.data || error.message });
    });;

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});


app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    await axios.post(SHEETS_API_URL, {
      data: {
        action: 'deleteOrder',
        orderId,
      },
    });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Product endpoints
app.get('/api/products', (req, res) => {
  try {
    if (!fs.existsSync(PRODUCTS_FILE_PATH)) {
      fs.writeFileSync(PRODUCTS_FILE_PATH, '[]');
    }
    const productsData = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8');
    res.json(JSON.parse(productsData));
  } catch (error: any) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to read products', details: error?.message || 'Unknown error' });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8'));
    const newProduct = {
      ...req.body,
      id: crypto.randomUUID()
    };
    products.push(newProduct);
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8'));
    const index = products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = { ...req.body, id };
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2));
    res.json(products[index]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8'));
    const filteredProducts = products.filter((p: any) => p.id !== id);
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(filteredProducts, null, 2));
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get all users
app.get('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to read users', details: error?.message || 'Unknown error' });
  }
});

// Add new user
app.post('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(USERS_FILE_PATH, 'utf8');
    const users = JSON.parse(data);
    const newUser = {
      id: crypto.randomUUID(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(users, null, 2));
    res.json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add user', details: error?.message || 'Unknown error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 