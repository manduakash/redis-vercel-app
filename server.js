import express from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create Redis Client
const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true, // Required for Upstash Redis
    rejectUnauthorized: false,
  },
});

client.on('error', (err) => console.error('❌ Redis Error:', err));

client.connect()
  .then(() => console.log('✅ Redis Connected'))
  .catch(err => console.error('❌ Redis Connection Failed:', err));

// API Route to Set and Get Data from Redis
app.get('/set', async (req, res) => {
  await client.set('message', 'Hello from Redis!', 'EX', 3600); // Expires in 1 hour
  res.send('✅ Key "message" set in Redis');
});

app.get('/get', async (req, res) => {
  const value = await client.get('message');
  res.send(value ? `🔹 Message from Redis: ${value}` : '❌ No message found');
});

app.get('/', async (req, res) => {
  res.send(`🔹 radis server is online`);
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
