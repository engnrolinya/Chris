import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Search,
  Download,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
  Eye,
  Save,
  Shield,
  KeyRound,
  AlertCircle,
  HelpCircle,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Enquiry, EnquiryStatus, EnquiryType, PaymentPlanType, ChatConversation } from '../types';
import { EnquiryService } from '../services/enquiryService';
import { ChatService } from '../services/chatService';
import { DEFAULT_SITE_SETTINGS } from '../data/initialData';

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerDashboardModal: React.FC<OwnerDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Live Chat state
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [agentReplyText, setAgentReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [chatFilter, setChatFilter] = useState<'all' | 'waiting_owner' | 'active' | 'resolved'>('all');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<EnquiryType | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<PaymentPlanType | 'all'>('all');

  // Selected for full detail modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('new');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  // Email Notification Preview Modal
  const [previewEmailEnquiry, setPreviewEmailEnquiry] = useState<Enquiry | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'enquiries' | 'chats' | 'settings'>('enquiries');

  // Fetch data
  const loadData = async () => {
    setIsLoading(true);
    const data = await EnquiryService.getEnquiries({
      search: searchQuery,
      status: statusFilter,
      enquiryType: typeFilter,
      paymentPlan: planFilter,
    });
    setEnquiries(data);

    // Also load chats
    const chatList = await ChatService.getAllConversations();
    setConversations(chatList);
    if (!selectedConversation && chatList.length > 0) {
      setSelectedConversation(chatList[0]);
    } else if (selectedConversation) {
      const refreshed = chatList.find((c) => c.id === selectedConversation.id);
      if (refreshed) setSelectedConversation(refreshed);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, searchQuery, statusFilter, typeFilter, planFilter, activeTab]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (EnquiryService.verifyOwnerPin(pinInput)) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect PIN. The default administrator passcode is CE2026.');
    }
  };

  const handleOpenDetail = (item: Enquiry) => {
    setSelectedEnquiry(item);
    setEditNotes(item.internalNotes || '');
    setEditStatus(item.status);
    setUpdateMessage(null);
  };

  const handleSaveDetail = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    await EnquiryService.updateEnquiry(selectedEnquiry.id, {
      status: editStatus,
      internalNotes: editNotes,
    });
    setIsUpdating(false);
    setUpdateMessage('Enquiry updated successfully.');
    setSelectedEnquiry({
      ...selectedEnquiry,
      status: editStatus,
      internalNotes: editNotes,
    });
    loadData();
  };

  const handleExportCsv = () => {
    EnquiryService.exportToCsv(enquiries);
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset database to sample demonstration leads?')) {
      EnquiryService.resetToDemo();
      loadData();
      if (selectedEnquiry) setSelectedEnquiry(null);
    }
  };

  // Chat Actions
  const handleSelectChat = async (convo: ChatConversation) => {
    setSelectedConversation(convo);
    if (convo.unreadByOwner) {
      await ChatService.updateConversationStatus(convo.id, convo.status, true);
      // update locally
      setConversations((prev) =>
        prev.map((c) => (c.id === convo.id ? { ...c, unreadByOwner: false } : c))
      );
    }
  };

  const handleSendAgentReply = async () => {
    if (!selectedConversation || !agentReplyText.trim() || isSendingReply) return;
    setIsSendingReply(true);

    const { conversation } = await ChatService.sendMessage(
      selectedConversation.id,
      {
        sender: 'agent',
        senderName: 'Engr. Olinya (Consistent Experts Sales Desk)',
        text: agentReplyText.trim(),
      }
    );

    setSelectedConversation(conversation);
    setConversations((prev) =>
      prev.map((c) => (c.id === conversation.id ? conversation : c))
    );
    setAgentReplyText('');
    setIsSendingReply(false);
  };

  const handleUpdateChatStatus = async (
    status: 'active' | 'waiting_owner' | 'resolved'
  ) => {
    if (!selectedConversation) return;
    await ChatService.updateConversationStatus(selectedConversation.id, status, true);
    const updated = { ...selectedConversation, status, unreadByOwner: false };
    setSelectedConversation(updated);
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleConvertChatToLead = async () => {
    if (!selectedConversation) return;
    const clientName = selectedConversation.customerName || 'Chat Visitor';
    const clientPhone = selectedConversation.customerPhone || '0916 950 8000';
    const transcript = selectedConversation.messages
      .map((m) => `${m.senderName}: ${m.text}`)
      .join('\n');

    await EnquiryService.submitEnquiry(
      {
        fullName: clientName,
        phone: clientPhone,
        email: selectedConversation.customerEmail || '',
        preferredContactMethod: 'phone',
        enquiryType: 'general',
        preferredPaymentPlan: '6_month_standard',
        propertySize: '500_sqm',
        preferredInspectionDate: '',
        message: `Converted from Live Chat (${selectedConversation.topic || 'Inquiry'}).\n\nTranscript:\n${transcript.slice(0, 800)}`,
        consent: true,
        honeypot: '',
      },
      'Live Chat Conversion'
    );

    alert(`Successfully converted ${clientName} into an official Enquiry Lead!`);
    loadData();
  };

  // Status badge helper
  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            New Lead
          </span>
        );
      case 'contacted':
        return (
          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Contacted
          </span>
        );
      case 'inspection_scheduled':
        return (
          <span className="text-[11px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Inspection Set
          </span>
        );
      case 'converted':
        return (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Converted
          </span>
        );
      case 'closed':
        return (
          <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Closed
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-6xl w-full bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#373E0C] text-white px-6 py-4.5 flex items-center justify-between border-b border-[#373E0C]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Shield className="w-5 h-5 text-[#E96818]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#E96818] uppercase tracking-wider">
                Consistent Experts Administration
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                New Dawn Smart City · Owner Portal
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#F2F6EF] border border-[#373E0C]/20 flex items-center justify-center text-[#373E0C]">
              <Lock className="w-8 h-8 text-[#E96818]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#373E0C]">
                Administrator Authentication
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                This dashboard gives the Consistent Experts sales team and business owners direct access to prospective buyer leads, inspection schedules, and contact preferences.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Passcode (Default: CE2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full px-4 py-3 text-center text-sm font-mono tracking-widest rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 text-xs font-bold text-white bg-[#E96818] hover:bg-[#d65b10] rounded-xl transition-all cursor-pointer shadow-md"
              >
                Access Enquiries Dashboard
              </button>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-500 text-left space-y-1">
                <span className="font-bold text-neutral-700 block">Default Setup Passcode:</span>
                <code>CE2026</code> (Authorized Consistent Experts internal admin)
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sub-header Navigation & Controls */}
            <div className="bg-neutral-50 border-b border-neutral-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
              {/* Tab Selector */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'enquiries'
                      ? 'bg-[#373E0C] text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Customer Enquiries ({enquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'chats'
                      ? 'bg-[#373E0C] text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#E96818]" />
                  <span>Live Chat ({conversations.length})</span>
                  {conversations.some((c) => c.unreadByOwner) && (
                    <span className="w-2 h-2 rounded-full bg-[#E96818] ring-2 ring-white animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-[#373E0C] text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  Company Contacts & Setup
                </button>
              </div>

              {/* Actions: Export CSV & Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#373E0C] bg-white border border-neutral-300 hover:bg-[#F2F6EF] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#E96818]" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleResetDemo}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 bg-white border border-neutral-200 rounded-lg transition-colors cursor-pointer"
                  title="Reset sample leads"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Samples</span>
                </button>
              </div>
            </div>

            {activeTab === 'enquiries' ? (
              <div className="flex-1 flex flex-col p-6 overflow-hidden space-y-4">
                {/* Search & Filter Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, phone, email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                    />
                  </div>

                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="inspection_scheduled">Inspection Set</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                    >
                      <option value="all">All Enquiry Types</option>
                      <option value="price_enquiry">Price Enquiry</option>
                      <option value="payment_plan">Payment Plan</option>
                      <option value="property_availability">Property Availability</option>
                      <option value="inspection_booking">Inspection Booking</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={planFilter}
                      onChange={(e) => setPlanFilter(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                    >
                      <option value="all">All Payment Plans</option>
                      <option value="6_month_standard">6-Month Standard (₦30M)</option>
                      <option value="8_month_promo">8-Month Promo (₦20M)</option>
                      <option value="undecided">Undecided</option>
                    </select>
                  </div>
                </div>

                {/* Table View */}
                <div className="flex-1 overflow-auto border border-neutral-200 rounded-2xl bg-white shadow-xs">
                  {enquiries.length === 0 ? (
                    <div className="text-center py-16 text-neutral-400 space-y-2">
                      <FileText className="w-10 h-10 mx-auto text-neutral-300" />
                      <div className="text-sm font-semibold text-neutral-600">
                        No enquiries match the selected filters
                      </div>
                      <div className="text-xs">Try clearing filters or search term</div>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50/80 border-b border-neutral-200 text-[11px] font-bold text-neutral-500 uppercase tracking-wider sticky top-0 z-10">
                          <th className="py-3 px-4">Client / Phone</th>
                          <th className="py-3 px-4">Type & Plan</th>
                          <th className="py-3 px-4">Contact Via</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                        {enquiries.map((enq) => (
                          <tr
                            key={enq.id}
                            className="hover:bg-[#F2F6EF]/40 transition-colors cursor-pointer"
                            onClick={() => handleOpenDetail(enq)}
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-[#373E0C]">
                                {enq.fullName}
                              </div>
                              <div className="font-mono text-neutral-500 text-[11px] mt-0.5">
                                {enq.phone}
                              </div>
                              {enq.email && (
                                <div className="text-neutral-400 text-[10px]">
                                  {enq.email}
                                </div>
                              )}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-neutral-800 capitalize">
                                {enq.enquiryType.replace(/_/g, ' ')}
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                {enq.preferredPaymentPlan === '6_month_standard'
                                  ? '6 Mos (₦30M)'
                                  : enq.preferredPaymentPlan === '8_month_promo'
                                  ? '8 Mos (₦20M)'
                                  : 'Undecided'}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 capitalize">
                              <span className="inline-flex items-center gap-1 font-medium text-neutral-600">
                                {enq.preferredContactMethod === 'whatsapp' ? (
                                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                                ) : enq.preferredContactMethod === 'email' ? (
                                  <Mail className="w-3.5 h-3.5 text-blue-500" />
                                ) : (
                                  <Phone className="w-3.5 h-3.5 text-[#E96818]" />
                                )}
                                {enq.preferredContactMethod}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              {getStatusBadge(enq.status)}
                            </td>

                            <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                              {new Date(enq.createdAt).toLocaleDateString()}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div
                                className="flex items-center justify-end gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => setPreviewEmailEnquiry(enq)}
                                  className="p-1.5 rounded-lg text-neutral-500 hover:text-[#373E0C] hover:bg-neutral-100 transition-colors"
                                  title="View Dispatched Notification Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenDetail(enq)}
                                  className="px-2.5 py-1 text-xs font-semibold text-[#373E0C] bg-[#F2F6EF] hover:bg-[#373E0C] hover:text-white rounded-lg transition-colors"
                                >
                                  Manage
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            ) : activeTab === 'chats' ? (
              /* Live Chat Conversations Management Tab */
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Conversations List Pane */}
                <div className="w-full md:w-80 lg:w-96 border-r border-neutral-200 bg-neutral-50/70 flex flex-col overflow-hidden">
                  {/* Chat Filter Bar */}
                  <div className="p-3 border-b border-neutral-200 bg-white">
                    <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold">
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'waiting_owner', label: 'Needs Reply' },
                        { id: 'active', label: 'Active' },
                        { id: 'resolved', label: 'Done' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setChatFilter(tab.id as any)}
                          className={`py-1.5 px-1 rounded-lg text-center transition-colors truncate ${
                            chatFilter === tab.id
                              ? 'bg-[#373E0C] text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List of Chat Threads */}
                  <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
                    {conversations.filter((c) => {
                      if (chatFilter === 'waiting_owner') return c.status === 'waiting_owner';
                      if (chatFilter === 'active') return c.status === 'active';
                      if (chatFilter === 'resolved') return c.status === 'resolved';
                      return true;
                    }).length === 0 ? (
                      <div className="p-8 text-center text-xs text-neutral-400">
                        No conversations in this view
                      </div>
                    ) : (
                      conversations
                        .filter((c) => {
                          if (chatFilter === 'waiting_owner') return c.status === 'waiting_owner';
                          if (chatFilter === 'active') return c.status === 'active';
                          if (chatFilter === 'resolved') return c.status === 'resolved';
                          return true;
                        })
                        .map((convo) => {
                          const isSelected = selectedConversation?.id === convo.id;
                          return (
                            <button
                              key={convo.id}
                              onClick={() => handleSelectChat(convo)}
                              className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                                isSelected
                                  ? 'bg-[#F2F6EF] border-l-4 border-[#373E0C]'
                                  : 'hover:bg-neutral-100 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="font-bold text-xs text-[#373E0C] flex items-center gap-1.5">
                                  <span>{convo.customerName || 'Prospective Investor'}</span>
                                  {convo.unreadByOwner && (
                                    <span className="w-2 h-2 rounded-full bg-[#E96818] ring-2 ring-white" />
                                  )}
                                </div>
                                <span className="text-[10px] text-neutral-400 font-mono">
                                  {new Date(convo.updatedAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>

                              <div className="text-[11px] text-neutral-600 font-medium">
                                {convo.customerPhone || 'Phone pending'}
                              </div>

                              <p className="text-xs text-neutral-500 line-clamp-1 italic">
                                &ldquo;{convo.lastMessageSnippet}&rdquo;
                              </p>

                              <div className="flex items-center justify-between text-[10px] pt-1">
                                <span className="text-[#E96818] font-semibold">
                                  {convo.topic || 'General Inquiry'}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full font-bold uppercase ${
                                    convo.status === 'waiting_owner'
                                      ? 'bg-amber-100 text-amber-800'
                                      : convo.status === 'active'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-neutral-200 text-neutral-600'
                                  }`}
                                >
                                  {convo.status === 'waiting_owner'
                                    ? 'Needs Reply'
                                    : convo.status === 'active'
                                    ? 'Active'
                                    : 'Resolved'}
                                </span>
                              </div>
                            </button>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Conversation Details & Thread Pane */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                  {selectedConversation ? (
                    <>
                      {/* Active Chat Header */}
                      <div className="p-4 border-b border-neutral-200 bg-neutral-50 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-[#373E0C]">
                              {selectedConversation.customerName || 'Prospective Investor'}
                            </h3>
                            <span className="text-xs text-neutral-500 font-mono">
                              ({selectedConversation.customerPhone || 'No phone provided'})
                            </span>
                          </div>
                          <div className="text-xs text-neutral-400">
                            Topic: {selectedConversation.topic || 'General Inquiry'} · ID: {selectedConversation.id}
                          </div>
                        </div>

                        {/* Direct Channel Buttons */}
                        <div className="flex items-center gap-2">
                          {selectedConversation.customerPhone && (
                            <>
                              <a
                                href={`tel:${selectedConversation.customerPhone.replace(/\s+/g, '')}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#373E0C] bg-white border border-neutral-300 rounded-lg hover:bg-[#F2F6EF]"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#E96818]" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/${selectedConversation.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `Hello ${selectedConversation.customerName || ''}, this is Consistent Experts following up on your live chat regarding New Dawn Smart City.`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] rounded-lg"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            </>
                          )}

                          <button
                            onClick={handleConvertChatToLead}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#373E0C] hover:bg-[#2b3109] rounded-lg"
                            title="Save this conversation as an official Enquiry Lead"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#E96818]" />
                            <span>Save as Lead</span>
                          </button>

                          {/* Status toggle */}
                          <select
                            value={selectedConversation.status}
                            onChange={(e) => handleUpdateChatStatus(e.target.value as any)}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 bg-white"
                          >
                            <option value="active">Active</option>
                            <option value="waiting_owner">Needs Reply</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      {/* Chat Messages Log */}
                      <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-neutral-50/40">
                        {selectedConversation.messages.map((m) => {
                          const isAgent = m.sender === 'agent';
                          const isSystem = m.sender === 'system';
                          return (
                            <div
                              key={m.id}
                              className={`flex flex-col ${
                                isSystem
                                  ? 'items-center text-center'
                                  : isAgent
                                  ? 'items-end'
                                  : 'items-start'
                              }`}
                            >
                              <div className="text-[10px] font-semibold text-neutral-400 mb-1 px-1">
                                {m.senderName} ·{' '}
                                {new Date(m.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>

                              <div
                                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs whitespace-pre-wrap ${
                                  isSystem
                                    ? 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                    : isAgent
                                    ? 'bg-[#373E0C] text-white rounded-br-xs'
                                    : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-xs'
                                }`}
                              >
                                {m.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Response Templates */}
                      <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 flex gap-2 overflow-x-auto text-xs">
                        <span className="text-[11px] font-bold text-neutral-400 self-center uppercase">
                          Quick:
                        </span>
                        <button
                          onClick={() =>
                            setAgentReplyText(
                              'Thank you for your interest! A 500 SQM plot reservation has been initiated. Our sales manager will contact you shortly.'
                            )
                          }
                          className="px-2.5 py-1 text-[11px] bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 whitespace-nowrap text-neutral-700"
                        >
                          Plot Reservation
                        </button>
                        <button
                          onClick={() =>
                            setAgentReplyText(
                              'We have scheduled your inspection at Plot 20, New Asaba. Our site engineer will meet you on-site.'
                            )
                          }
                          className="px-2.5 py-1 text-[11px] bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 whitespace-nowrap text-neutral-700"
                        >
                          Confirm Inspection
                        </button>
                        <button
                          onClick={() =>
                            setAgentReplyText(
                              'You can call our direct sales line at 0916 950 8000 for immediate telephone consultation.'
                            )
                          }
                          className="px-2.5 py-1 text-[11px] bg-white border border-neutral-200 rounded-lg hover:bg-neutral-100 whitespace-nowrap text-neutral-700"
                        >
                          Hotline Consult
                        </button>
                      </div>

                      {/* Reply Input Box */}
                      <div className="p-3 bg-white border-t border-neutral-200 flex gap-2">
                        <textarea
                          rows={2}
                          placeholder="Type reply as Consistent Experts property advisor..."
                          value={agentReplyText}
                          onChange={(e) => setAgentReplyText(e.target.value)}
                          className="flex-1 p-2.5 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                        />
                        <button
                          onClick={handleSendAgentReply}
                          disabled={!agentReplyText.trim() || isSendingReply}
                          className="px-4 bg-[#E96818] hover:bg-[#d65b10] disabled:bg-neutral-300 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>{isSendingReply ? 'Sending...' : 'Send'}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs">
                      <MessageSquare className="w-12 h-12 text-neutral-300 mb-2" />
                      <div>Select a conversation from the left to view and reply</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Settings & Configuration Tab */
              <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
                <div className="max-w-3xl space-y-6">
                  <div className="border-b border-neutral-200 pb-4">
                    <h3 className="text-lg font-bold text-[#373E0C]">
                      Consistent Experts System Settings
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1">
                      Configure contact numbers, email endpoints, and notification dispatches for New Dawn Smart City.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Notification Recipient
                      </div>
                      <div className="text-sm font-bold text-[#373E0C]">
                        {DEFAULT_SITE_SETTINGS.email}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        All incoming website enquiries and inspection bookings trigger an alert to this address.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Primary WhatsApp Dispatch
                      </div>
                      <div className="text-sm font-bold text-emerald-700">
                        +{DEFAULT_SITE_SETTINGS.primaryWhatsAppPhone}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        Nigeria international format (+234) without leading zero.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                      Active Customer Hotlines (From Flyer)
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      {DEFAULT_SITE_SETTINGS.phones.map((p, idx) => (
                        <div
                          key={p}
                          className="p-3 bg-white border border-neutral-200 rounded-lg flex items-center justify-between font-mono"
                        >
                          <span className="font-semibold text-neutral-800">
                            Line {idx + 1}: {p}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold uppercase">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                    <div className="font-bold">Before Launch Checklist:</div>
                    <ul className="list-disc list-inside space-y-1 text-amber-800">
                      <li>Confirm that info@consistentexperts.com inbox is active.</li>
                      <li>Verify WhatsApp business account on +234 916 950 8000.</li>
                      <li>Review estate plot availability before accepting deposits.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Enquiry Detail Drawer / Modal */}
        {selectedEnquiry && (
          <div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedEnquiry(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#E96818] uppercase tracking-wider">
                    {selectedEnquiry.id}
                  </div>
                  <h3 className="text-xl font-bold text-[#373E0C] mt-0.5">
                    {selectedEnquiry.fullName}
                  </h3>
                  <div className="text-xs text-neutral-500 mt-1">
                    Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString()} · From {selectedEnquiry.sourceSection}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Direct Strip */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${selectedEnquiry.phone.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center gap-2 p-2.5 bg-[#F2F6EF] text-[#373E0C] font-bold rounded-xl border border-[#373E0C]/15 hover:bg-[#373E0C] hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedEnquiry.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedEnquiry.fullName}, this is Consistent Experts following up on your New Dawn Smart City enquiry.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200 hover:bg-[#25D366] hover:text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Client</span>
                </a>
              </div>

              {/* Client Message */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-1.5 text-xs">
                <span className="font-bold text-neutral-700 uppercase tracking-wider block text-[10px]">
                  Customer Message:
                </span>
                <p className="text-neutral-800 leading-relaxed italic whitespace-pre-wrap">
                  &ldquo;{selectedEnquiry.message}&rdquo;
                </p>
                {selectedEnquiry.preferredInspectionDate && (
                  <div className="pt-2 text-[11px] font-semibold text-[#373E0C]">
                    Requested Inspection Date: {selectedEnquiry.preferredInspectionDate}
                  </div>
                )}
              </div>

              {/* Status Updater */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Lead Status:
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="inspection_scheduled">Inspection Scheduled</option>
                  <option value="converted">Converted (Deposit / Plot Allocated)</option>
                  <option value="closed">Closed / Inactive</option>
                </select>
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Internal Team Notes:
                </label>
                <textarea
                  rows={3}
                  placeholder="Record outcome of phone call, site inspection notes, plot allocations..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#E96818]"
                />
              </div>

              {updateMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                  {updateMessage}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveDetail}
                  disabled={isUpdating}
                  className="flex-1 py-3 px-4 text-xs font-bold text-white bg-[#373E0C] hover:bg-[#2b3109] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isUpdating ? 'Saving...' : 'Save Updates'}</span>
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-3 text-xs font-semibold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Notification Simulator View */}
        {previewEmailEnquiry && (
          <div
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setPreviewEmailEnquiry(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-4 shadow-2xl border border-neutral-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#373E0C]">
                  <Mail className="w-4 h-4 text-[#E96818]" />
                  <span>Owner Notification Dispatch Preview</span>
                </div>
                <button
                  onClick={() => setPreviewEmailEnquiry(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-neutral-900 text-white rounded-2xl p-5 text-xs font-mono space-y-2">
                <div className="text-neutral-400">
                  To: <span className="text-white">info@consistentexperts.com</span>
                </div>
                <div className="text-neutral-400">
                  Subject:{' '}
                  <span className="text-[#E96818]">
                    New Lead: {previewEmailEnquiry.fullName} – New Dawn Smart City
                  </span>
                </div>
                <div className="text-neutral-400">
                  Reply-To:{' '}
                  <span className="text-white">
                    {previewEmailEnquiry.email || previewEmailEnquiry.phone}
                  </span>
                </div>
                <div className="border-t border-neutral-800 pt-3 text-neutral-300 space-y-1">
                  <div>Name: {previewEmailEnquiry.fullName}</div>
                  <div>Phone: {previewEmailEnquiry.phone}</div>
                  <div>Email: {previewEmailEnquiry.email || 'None provided'}</div>
                  <div>Enquiry Type: {previewEmailEnquiry.enquiryType}</div>
                  <div>Plan: {previewEmailEnquiry.preferredPaymentPlan}</div>
                  <div>Size: {previewEmailEnquiry.propertySize}</div>
                  {previewEmailEnquiry.preferredInspectionDate && (
                    <div>
                      Inspection Date: {previewEmailEnquiry.preferredInspectionDate}
                    </div>
                  )}
                  <div className="pt-2 text-white font-sans text-xs">
                    Message: &ldquo;{previewEmailEnquiry.message}&rdquo;
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500">
                This notification is dispatched automatically when buyers submit the enquiry form or book an inspection.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
