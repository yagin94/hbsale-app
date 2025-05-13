import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets API URL
const SHEETS_API_URL = process.env.SHEETS_API_URL || 'https://script.google.com/macros/s/AKfycbwxaxezX0avDxPsWsS5cxiKs8jzr9KHIC7eBIK7vq86Vd3u9KINgEAQ-PV7F2KPF4hYnQ/exec';
// Types
interface Order {
  id: string;
  customerName: string;
  facebookLink: string;
  address: string;
  product: string;
  size: string;
  color: string;
  sellingPrice: number;
  costPrice: number;
  isFulfilled: boolean;
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
    await axios.put(SHEETS_API_URL, {
      action: 'updateOrderStatus',
      orderId,
      isFulfilled,
    });
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.delete('/api/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    await axios.delete(SHEETS_API_URL, {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 