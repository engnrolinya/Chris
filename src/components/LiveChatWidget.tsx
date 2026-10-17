import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Calendar,
  DollarSign,
  MapPin,
  ShieldCheck,
  ChevronRight,
  User,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, ChatConversation } from '../types';
import { ChatService } from '../services/chatService';
import { EnquiryService } from './../services/enquiryService';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface LiveChatWidgetProps {
  onOpenFullInspection: () => void;
  onOpenPaymentPlans: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  onOpenFullInspection,
  onOpenPaymentPlans,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [hasPromptedContact, setHasPromptedContact] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // In-chat mini inspection flow
  const [showInChatInspection, setShowInChatInspection] = useState(false);
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionSubmitting, setInspectionSubmitting] = useState(false);
  const [inspectionSuccess, setInspectionSuccess] = useState(false);

  const conversationId = useRef<string>(ChatService.getActiveConversationId()).current;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load existing conversation
  const loadConversation = async () => {
    const convo = await ChatService.getConversation(conversationId);
    if (convo && convo.messages.length > 0) {
      setMessages(convo.messages);
      if (convo.customerName) setCustomerName(convo.customerName);
      if (convo.customerPhone) setCustomerPhone(convo.customerPhone);
    } else {
      // Initialize with welcome message
      const welcomeMsg: ChatMessage = {
        id: 'msg-welcome',
        sender: 'agent',
        senderName: 'Consistent Experts Live Desk',
        text: 'Hello and welcome to Consistent Experts! 👋\n\nHow can we help you today with New Dawn Smart City in New Asaba? Choose a topic below or type your message.',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  };

  useEffect(() => {
    loadConversation();
  }, []);

  // Poll for agent replies while open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(async () => {
      const convo = await ChatService.getConversation(conversationId);
      if (convo && convo.messages.length !== messages.length) {
        setMessages(convo.messages);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, showInChatInspection]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    setIsSending(true);
    setInputText('');

    // Append user message
    const { conversation, message } = await ChatService.sendMessage(
      conversationId,
      {
        sender: 'user',
        senderName: customerName.trim() || 'Prospective Investor',
        text,
      },
      {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        topic: 'Live Website Chat',
      }
    );

    setMessages([...conversation.messages]);
    setIsSending(false);

    // Auto-reply logic if it's the first user inquiry
    if (conversation.messages.filter((m) => m.sender === 'user').length === 1 && !customerPhone) {
      setTimeout(async () => {
        const promptMsg: ChatMessage = {
          id: `sys-contact-${Date.now()}`,
          sender: 'agent',
          senderName: 'Consistent Experts Live Desk',
          text: 'Thank you for your inquiry! To ensure our property consultant can contact you with full plot allocation details, please share your phone number.',
          timestamp: new Date().toISOString(),
        };
        const updated = await ChatService.sendMessage(conversationId, promptMsg);
        setMessages([...updated.conversation.messages]);
      }, 1200);
    }
  };

  const handleQuickTopic = async (topicKey: 'prices' | 'inspection' | 'features' | 'consultant') => {
    const topic = ChatService.getInstantAnswer(topicKey);

    // 1. Add user click as their query
    const userMsgText =
      topicKey === 'prices'
        ? 'What are the current plot prices and payment plans?'
        : topicKey === 'inspection'
        ? 'I would like to book a physical property inspection at Plot 20.'
        : topicKey === 'features'
        ? 'What are the estate features and infrastructure at New Dawn Smart City?'
        : 'I would like to speak directly with a property consultant.';

    await ChatService.sendMessage(conversationId, {
      sender: 'user',
      senderName: customerName.trim() || 'Prospective Investor',
      text: userMsgText,
    });

    // 2. Deliver verified instant answer
    setTimeout(async () => {
      const { conversation } = await ChatService.sendMessage(conversationId, {
        sender: 'agent',
        senderName: 'Consistent Experts Live Desk',
        text: topic.text,
        quickAction: topic.quickAction,
      });
      setMessages([...conversation.messages]);

      if (topicKey === 'inspection') {
        setShowInChatInspection(true);
      }
    }, 600);
  };

  const handleInChatInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and telephone number.');
      return;
    }

    setInspectionSubmitting(true);

    try {
      await EnquiryService.submitEnquiry(
        {
          fullName: customerName.trim(),
          phone: customerPhone.trim(),
          email: '',
          preferredContactMethod: 'phone',
          enquiryType: 'inspection_booking',
          preferredPaymentPlan: '6_month_standard',
          propertySize: '500_sqm',
          preferredInspectionDate: inspectionDate,
          message: `Scheduled via Live Chat Widget for inspection on ${inspectionDate || 'convenient date'}.`,
          consent: true,
          honeypot: '',
        },
        'Live Chat Widget'
      );

      setInspectionSuccess(true);
      setShowInChatInspection(false);

      // Post confirmation in chat
      const confirmationMsg: ChatMessage = {
        id: `conf-${Date.now()}`,
        sender: 'agent',
        senderName: 'Consistent Experts Live Desk',
        text: `✅ Inspection Request Logged!\n\nThank you, ${customerName}. Your site visit request for Plot 20, New Asaba has been received. Our site coordinator will call ${customerPhone} to finalize your time slot.`,
        timestamp: new Date().toISOString(),
      };
      const updated = await ChatService.sendMessage(conversationId, confirmationMsg);
      setMessages([...updated.conversation.messages]);
    } catch {
      alert('Error scheduling inspection. Please retry or contact 0916 950 8000.');
    } finally {
      setInspectionSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
          <button
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="group flex items-center gap-2.5 py-3 px-4.5 bg-[#373E0C] hover:bg-[#2b3109] text-white font-bold text-xs rounded-full shadow-2xl transition-all duration-200 cursor-pointer border-2 border-white/80 active:scale-95"
            aria-label="Open Consistent Experts Live Chat Support"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-[#E96818]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
            </div>
            <span className="tracking-wide">Support Desk</span>
            <span className="hidden sm:inline text-[11px] font-normal text-neutral-300">
              · Online
            </span>
          </button>
        </div>
      )}

      {/* Expanded Live Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[400px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#373E0C] text-white p-4 flex items-center justify-between border-b border-[#373E0C]/40">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#E96818]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#373E0C] rounded-full" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Consistent Experts</span>
                  <span className="text-[10px] text-[#E96818] uppercase tracking-wider font-semibold">
                    Live Desk
                  </span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  New Dawn Smart City · New Asaba
                </div>
              </div>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-1">
              <a
                href={`https://wa.me/${DEFAULT_SITE_SETTINGS.primaryWhatsAppPhone}?text=${encodeURIComponent(
                  'Hello Consistent Experts, I am chatting from the website regarding New Dawn Smart City.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg text-emerald-400 hover:bg-white/10 transition-colors"
                title="Switch to WhatsApp"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Channels Strip */}
          <div className="bg-[#F2F6EF] px-3.5 py-2 border-b border-neutral-200/80 flex items-center justify-between text-[11px] text-[#373E0C]">
            <div className="flex items-center gap-1 font-semibold">
              <Phone className="w-3 h-3 text-[#E96818]" />
              <span>Hotline: 0916 950 8000</span>
            </div>
            <a
              href={`tel:09169508000`}
              className="text-xs font-bold text-[#E96818] hover:underline"
            >
              Call Now
            </a>
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] font-semibold text-neutral-400 mb-1 px-1">
                    {msg.senderName} · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed shadow-xs whitespace-pre-wrap ${
                      isUser
                        ? 'bg-[#373E0C] text-white rounded-br-xs'
                        : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Inline Action Triggers */}
                  {msg.quickAction === 'view_prices' && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenPaymentPlans();
                      }}
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white px-3 py-1.5 rounded-lg border border-[#373E0C]/20 transition-colors"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-[#E96818]" />
                      <span>View Payment Spread Calculator</span>
                    </button>
                  )}

                  {msg.quickAction === 'book_inspection' && !showInChatInspection && (
                    <button
                      onClick={() => setShowInChatInspection(true)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Pick an Inspection Date</span>
                    </button>
                  )}
                </div>
              );
            })}

            {/* In-Chat Inspection Card */}
            {showInChatInspection && (
              <div className="p-4 bg-white rounded-2xl border-2 border-[#E96818]/60 shadow-md space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-bold text-xs text-[#373E0C] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#E96818]" />
                    <span>Quick Inspection Booking</span>
                  </div>
                  <button
                    onClick={() => setShowInChatInspection(false)}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <form onSubmit={handleInChatInspectionSubmit} className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Emeka"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0916 950 8000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-600 uppercase">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      required
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={inspectionSubmitting}
                    className="w-full py-2 bg-[#E96818] hover:bg-[#d65b10] text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {inspectionSubmitting ? 'Scheduling...' : 'Confirm Site Inspection'}
                  </button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Instant Quick-Topic Buttons */}
          <div className="px-3 py-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleQuickTopic('prices')}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white rounded-lg border border-[#373E0C]/15 whitespace-nowrap transition-colors"
            >
              Plot Prices (₦20M / ₦30M)
            </button>
            <button
              onClick={() => handleQuickTopic('inspection')}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white rounded-lg border border-[#373E0C]/15 whitespace-nowrap transition-colors"
            >
              Book Inspection
            </button>
            <button
              onClick={() => handleQuickTopic('features')}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white rounded-lg border border-[#373E0C]/15 whitespace-nowrap transition-colors"
            >
              Estate Features
            </button>
            <button
              onClick={() => handleQuickTopic('consultant')}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white rounded-lg border border-[#373E0C]/15 whitespace-nowrap transition-colors"
            >
              Speak to Team
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about New Dawn Smart City..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="p-2.5 bg-[#E96818] hover:bg-[#d65b10] disabled:bg-neutral-300 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
