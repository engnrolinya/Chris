import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory / file backup store for enquiries and chats
const ENQUIRIES_FILE = path.join(__dirname, '.enquiries_data.json');
const CHATS_FILE = path.join(__dirname, '.chats_data.json');

function loadEnquiries(): any[] {
  try {
    if (fs.existsSync(ENQUIRIES_FILE)) {
      const data = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading enquiries file', err);
  }
  return [];
}

function saveEnquiries(data: any[]): void {
  try {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing enquiries file', err);
  }
}

function loadChats(): any[] {
  try {
    if (fs.existsSync(CHATS_FILE)) {
      const data = fs.readFileSync(CHATS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading chats file', err);
  }
  return [];
}

function saveChats(data: any[]): void {
  try {
    fs.writeFileSync(CHATS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing chats file', err);
  }
}

// REST API Endpoints
app.post('/api/enquiries', (req: Request, res: Response) => {
  const enquiry = req.body;
  if (!enquiry || !enquiry.fullName || !enquiry.phone || !enquiry.message) {
    return res.status(400).json({ error: 'Missing required enquiry fields' });
  }

  const existing = loadEnquiries();
  const record = {
    ...enquiry,
    id: enquiry.id || `ENQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: enquiry.createdAt || new Date().toISOString(),
    status: enquiry.status || 'new',
    notificationSentToOwner: true,
  };

  existing.unshift(record);
  saveEnquiries(existing);

  // Log simulated email notification to Consistent Experts
  console.log(`[Notification to info@consistentexperts.com] New property enquiry from ${record.fullName} (${record.phone}) regarding ${record.enquiryType} for ${record.preferredPaymentPlan}`);

  return res.status(201).json({ success: true, enquiry: record });
});

app.get('/api/enquiries', (_req: Request, res: Response) => {
  const list = loadEnquiries();
  return res.json({ success: true, enquiries: list });
});

app.patch('/api/enquiries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const list = loadEnquiries();
  const index = list.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  list[index] = { ...list[index], ...updates };
  saveEnquiries(list);
  return res.json({ success: true, enquiry: list[index] });
});

// Live Chat API Endpoints
app.get('/api/chats', (req: Request, res: Response) => {
  const { id } = req.query;
  const list = loadChats();
  if (id) {
    const convo = list.find((c) => c.id === id);
    return res.json({ success: true, conversation: convo || null });
  }
  return res.json({ success: true, conversations: list });
});

app.post('/api/chats/message', (req: Request, res: Response) => {
  const { conversationId, message, customerInfo } = req.body;
  if (!message || !message.text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const list = loadChats();
  let convo = list.find((c) => c.id === conversationId);

  const now = new Date().toISOString();
  const msgRecord = {
    ...message,
    id: message.id || `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: message.timestamp || now,
  };

  if (!convo) {
    convo = {
      id: conversationId || `CHAT-${Date.now()}`,
      customerName: customerInfo?.name || 'Prospective Investor',
      customerPhone: customerInfo?.phone || '',
      customerEmail: customerInfo?.email || '',
      status: message.sender === 'agent' ? 'active' : 'waiting_owner',
      createdAt: now,
      updatedAt: now,
      lastMessageSnippet: msgRecord.text.slice(0, 100),
      unreadByOwner: message.sender === 'user',
      topic: customerInfo?.topic || 'General Inquiry',
      messages: [msgRecord],
    };
    list.unshift(convo);
  } else {
    if (customerInfo?.name) convo.customerName = customerInfo.name;
    if (customerInfo?.phone) convo.customerPhone = customerInfo.phone;
    if (customerInfo?.email) convo.customerEmail = customerInfo.email;
    if (customerInfo?.topic) convo.topic = customerInfo.topic;

    convo.messages.push(msgRecord);
    convo.updatedAt = now;
    convo.lastMessageSnippet = msgRecord.text.slice(0, 100);
    if (message.sender === 'user') {
      convo.unreadByOwner = true;
      convo.status = 'waiting_owner';
    } else if (message.sender === 'agent') {
      convo.unreadByOwner = false;
      convo.status = 'active';
    }
  }

  saveChats(list);
  return res.status(201).json({ success: true, conversation: convo, message: msgRecord });
});

app.patch('/api/chats/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, markRead } = req.body;
  const list = loadChats();
  const convo = list.find((c) => c.id === id);

  if (!convo) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  if (status) convo.status = status;
  if (markRead) convo.unreadByOwner = false;
  convo.updatedAt = new Date().toISOString();

  saveChats(list);
  return res.json({ success: true, conversation: convo });
});

app.get('/api/health', (_req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    app: 'Consistent Experts - New Dawn Smart City API',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (!isProd) {
    // Mount Vite dev server middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Consistent Experts server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
