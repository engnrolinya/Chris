import { ChatConversation, ChatMessage } from '../types';
import { EnquiryService } from './enquiryService';

const CHAT_STORAGE_KEY = 'ce_live_chats_v1';
const CURRENT_CONVERSATION_ID_KEY = 'ce_active_conversation_id';

const SAMPLE_CHATS: ChatConversation[] = [
  {
    id: 'CHAT-101',
    customerName: 'Barrister Kenneth Umeh',
    customerPhone: '0802 334 5566',
    customerEmail: 'k.umeh@legalchambers.ng',
    status: 'waiting_owner',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    lastMessageSnippet: 'Can we schedule an inspection this Saturday at 11:00 AM at Plot 20?',
    unreadByOwner: true,
    topic: 'Inspection Booking',
    messages: [
      {
        id: 'msg-1',
        sender: 'system',
        senderName: 'Consistent Experts Live Desk',
        text: 'Welcome to Consistent Experts – New Dawn Smart City support desk. How may we assist your property acquisition today?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'user',
        senderName: 'Barrister Kenneth Umeh',
        text: 'Hello, I am interested in inspecting the estate site. Can we schedule an inspection this Saturday at 11:00 AM at Plot 20?',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      },
    ],
  },
  {
    id: 'CHAT-102',
    customerName: 'Mrs. Chinyere Nwosu',
    customerPhone: '0814 555 7890',
    customerEmail: 'chinyere.nwosu@gmail.com',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    lastMessageSnippet: 'Thank you, I will prepare my deposit for the 6-month standard plan.',
    unreadByOwner: false,
    topic: 'Payment Plan Inquiry',
    messages: [
      {
        id: 'msg-201',
        sender: 'user',
        senderName: 'Mrs. Chinyere Nwosu',
        text: 'Is the ₦30M 6-month plan strictly for 500 SQM plots?',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
      },
      {
        id: 'msg-202',
        sender: 'agent',
        senderName: 'Engr. Olinya (Consistent Experts)',
        text: 'Yes Madam, the ₦30,000,000 standard plan covers a full 500 SQM residential plot with infrastructure access. You can spread payments over 6 equal months.',
        timestamp: new Date(Date.now() - 3600000 * 7).toISOString(),
      },
      {
        id: 'msg-203',
        sender: 'user',
        senderName: 'Mrs. Chinyere Nwosu',
        text: 'Thank you, I will prepare my deposit for the 6-month standard plan.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ],
  },
];

export class ChatService {
  public static getActiveConversationId(): string {
    let id = sessionStorage.getItem(CURRENT_CONVERSATION_ID_KEY);
    if (!id) {
      id = `CHAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      sessionStorage.setItem(CURRENT_CONVERSATION_ID_KEY, id);
    }
    return id;
  }

  private static getStoredChats(): ChatConversation[] {
    try {
      const data = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(SAMPLE_CHATS));
        return SAMPLE_CHATS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_CHATS;
    }
  }

  private static saveStoredChats(list: ChatConversation[]): void {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to store chats', e);
    }
  }

  public static async getConversation(conversationId: string): Promise<ChatConversation | null> {
    try {
      const res = await fetch(`/api/chats?id=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.conversation) return data.conversation;
      }
    } catch {
      // Fallback to local
    }
    const list = this.getStoredChats();
    return list.find((c) => c.id === conversationId) || null;
  }

  public static async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const res = await fetch('/api/chats');
      if (res.ok) {
        const data = await res.json();
        if (data.conversations && data.conversations.length > 0) {
          return data.conversations;
        }
      }
    } catch {
      // Fallback
    }
    return this.getStoredChats();
  }

  public static async sendMessage(
    conversationId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>,
    customerInfo?: { name?: string; phone?: string; email?: string; topic?: string }
  ): Promise<{ conversation: ChatConversation; message: ChatMessage }> {
    const fullMessage: ChatMessage = {
      ...message,
      id: `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };

    // Try backend
    try {
      const res = await fetch('/api/chats/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: fullMessage, customerInfo }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.conversation) {
          // Also sync to local
          const list = this.getStoredChats();
          const idx = list.findIndex((c) => c.id === conversationId);
          if (idx !== -1) {
            list[idx] = data.conversation;
          } else {
            list.unshift(data.conversation);
          }
          this.saveStoredChats(list);
          return { conversation: data.conversation, message: data.message };
        }
      }
    } catch {
      // Fallback to local store
    }

    const list = this.getStoredChats();
    let convo = list.find((c) => c.id === conversationId);
    const now = new Date().toISOString();

    if (!convo) {
      convo = {
        id: conversationId,
        customerName: customerInfo?.name || 'Prospective Investor',
        customerPhone: customerInfo?.phone || '',
        customerEmail: customerInfo?.email || '',
        status: message.sender === 'agent' ? 'active' : 'waiting_owner',
        createdAt: now,
        updatedAt: now,
        lastMessageSnippet: fullMessage.text.slice(0, 80),
        unreadByOwner: message.sender === 'user',
        topic: customerInfo?.topic || 'General Inquiry',
        messages: [fullMessage],
      };
      list.unshift(convo);
    } else {
      if (customerInfo?.name) convo.customerName = customerInfo.name;
      if (customerInfo?.phone) convo.customerPhone = customerInfo.phone;
      if (customerInfo?.email) convo.customerEmail = customerInfo.email;
      if (customerInfo?.topic) convo.topic = customerInfo.topic;

      convo.messages.push(fullMessage);
      convo.updatedAt = now;
      convo.lastMessageSnippet = fullMessage.text.slice(0, 80);
      if (message.sender === 'user') {
        convo.unreadByOwner = true;
        convo.status = 'waiting_owner';
      } else if (message.sender === 'agent') {
        convo.unreadByOwner = false;
        convo.status = 'active';
      }
    }

    this.saveStoredChats(list);
    return { conversation: convo, message: fullMessage };
  }

  public static async updateConversationStatus(
    conversationId: string,
    status: 'active' | 'waiting_owner' | 'resolved',
    markRead = false
  ): Promise<boolean> {
    try {
      await fetch(`/api/chats/${conversationId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, markRead }),
      });
    } catch {
      // Continue to local
    }

    const list = this.getStoredChats();
    const convo = list.find((c) => c.id === conversationId);
    if (convo) {
      convo.status = status;
      if (markRead) convo.unreadByOwner = false;
      convo.updatedAt = new Date().toISOString();
      this.saveStoredChats(list);
      return true;
    }
    return false;
  }

  // Generate instant verified support answers for common inquiry topics
  public static getInstantAnswer(topicKey: string): {
    title: string;
    text: string;
    quickAction?: 'view_prices' | 'book_inspection' | 'call_hotline' | 'open_whatsapp';
  } {
    switch (topicKey) {
      case 'prices':
        return {
          title: 'Plot Prices & Payment Plans',
          text: `Here is the current pricing structure for New Dawn Smart City (Plot 20, New Asaba):\n\n• Standard 6-Month Plan: ₦30,000,000 per 500 SQM plot (Active plan commenced 1 October 2026).\n• 8-Month Promotional Plan: ₦20,000,000 per 500 SQM (The advertised 30 September 2026 deadline has passed; please confirm current promotional availability with our sales desk).\n\nWould you like to calculate your monthly installments or speak with a sales consultant?`,
          quickAction: 'view_prices',
        };
      case 'inspection':
        return {
          title: 'Book a Physical Property Inspection',
          text: `We conduct guided physical plot inspections at Plot 20, New Asaba, Delta State from Monday to Saturday (9:00 AM – 5:00 PM).\n\nTo schedule a site visit, please share your preferred date and telephone number, or tap the button below to use our streamlined inspection booking form. Our site engineer will reach out to confirm your slot.`,
          quickAction: 'book_inspection',
        };
      case 'features':
        return {
          title: 'Estate Features & Masterplan',
          text: `New Dawn Smart City is planned with 6 verified key infrastructure provisions:\n\n1. Steady Electricity: Designed for reliable power access.\n2. Street Lights: Designed to enhance visibility throughout roads.\n3. Good Road Network: Paved internal carriageways.\n4. Gated Community: Controlled residential perimeter access.\n5. 24/7 Security: Around-the-clock security arrangements.\n6. Serene Environment: Calm, comfortable residential living.`,
          quickAction: 'call_hotline',
        };
      case 'consultant':
        return {
          title: 'Speak with Consistent Experts Team',
          text: `You can reach our sales desk immediately:\n\n• Hotline 1: 0916 950 8000\n• Hotline 2: 0813 601 9021\n• Hotline 3: 0901 968 2520\n• Hotline 4: 0816 314 1151\n• WhatsApp: +234 916 950 8000\n• Email: info@consistentexperts.com\n\nOur team is available to assist you right now!`,
          quickAction: 'open_whatsapp',
        };
      default:
        return {
          title: 'Consistent Experts Support',
          text: `Thank you for reaching out to Consistent Experts. We have received your inquiry regarding New Dawn Smart City. A property advisor has been notified and will reply shortly.`,
        };
    }
  }
}
