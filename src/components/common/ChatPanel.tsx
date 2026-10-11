import React, { useState, useEffect, useRef } from 'react';
import { DealMessage, QuoteNegotiation, DealStage } from '../../types';
import { QuoteCard } from './QuoteCard';
import { Send, Shield, DollarSign, CheckCheck, Clock, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dealsApi } from '../../api';

interface ChatPanelProps {
  dealId: string;
  stage: DealStage;
  counterpartyName: string;
  counterpartyPhone?: string;
  counterpartyEmail?: string;
  onQuoteAccepted?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  dealId,
  stage,
  counterpartyName,
  counterpartyPhone,
  counterpartyEmail,
  onQuoteAccepted,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DealMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quotePrice, setQuotePrice] = useState('2400');
  const [quoteQuantity, setQuoteQuantity] = useState('200');
  const [quoteNotes, setQuoteNotes] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    let isMounted = true;
    const fetchMsgs = async () => {
      try {
        const data = await dealsApi.getMessages(dealId);
        if (isMounted) setMessages(data);
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    };
    fetchMsgs();

    return () => {
      isMounted = false;
    };
  }, [dealId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const content = inputText.trim();
    setInputText('');
    setIsSending(true);

    // Optimistic message
    const optimisticMsg: DealMessage = {
      id: 'opt-' + Date.now(),
      dealId,
      senderId: user?.id || 'curr-user',
      senderName: user?.industryName || 'You',
      senderRole: 'buyer',
      content,
      timestamp: new Date().toISOString(),
      isOptimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const saved = await dealsApi.sendMessage(dealId, content);
      setMessages((prev) => prev.map((m) => (m.id === optimisticMsg.id ? saved : m)));
    } catch (err) {
      console.error('Send message failed', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendQuote = async () => {
    const quote: QuoteNegotiation = {
      id: 'quote-' + Date.now(),
      proposedPricePerTon: parseFloat(quotePrice) || 2400,
      quantityTons: parseFloat(quoteQuantity) || 100,
      offeredBy: 'buyer',
      senderName: user?.industryName || 'You',
      status: 'pending',
      notes: quoteNotes,
      createdAt: new Date().toISOString(),
    };

    setShowQuoteModal(false);
    setIsSending(true);

    try {
      const msg = await dealsApi.sendMessage(
        dealId,
        `Submitted updated commercial quote: ₹${quote.proposedPricePerTon}/ton for ${quote.quantityTons} MT.`,
        quote
      );
      setMessages((prev) => [...prev, msg]);
    } finally {
      setIsSending(false);
    }
  };

  const isAgreedOrLater = stage !== 'negotiation';

  return (
    <div className="flex flex-col h-[560px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs">
      {/* Chat header */}
      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            {counterpartyName}
          </h4>
          <span className="text-xs text-stone-500">Live Secure Negotiation Channel</span>
        </div>

        <button
          type="button"
          onClick={() => setShowQuoteModal(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <DollarSign className="w-3.5 h-3.5" />
          Propose Quote
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-800/60 flex items-center gap-2 text-xs text-amber-900 dark:text-amber-200">
        <Shield className="w-3.5 h-3.5 shrink-0 text-amber-700" />
        <span>
          {isAgreedOrLater ? (
            <span className="font-medium text-emerald-800 dark:text-emerald-300">
              Commercial agreement confirmed: Counterparty Phone: {counterpartyPhone || '+91 94432 18920'} · Email: {counterpartyEmail || 'desk@ponnisugars.co.in'}
            </span>
          ) : (
            'Direct phone & contact emails are masked until terms are Agreed to ensure platform compliance & escrow protection.'
          )}
        </span>
      </div>

      {/* Messages list */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((m) => {
          const isMe = Boolean(m.senderId === user?.id || m.senderRole === 'buyer' || m.senderName.includes('Kothari') || m.isOptimistic);
          const isSystem = m.senderRole === 'system';

          if (isSystem) {
            return (
              <div key={m.id} className="text-center my-3">
                <span className="inline-block bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] px-3 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                  {m.content}
                </span>
              </div>
            );
          }

          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-stone-400 mb-0.5 px-1">{m.senderName}</span>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs ${
                  isMe
                    ? 'bg-emerald-700 text-white rounded-br-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-xs border border-stone-200 dark:border-stone-700'
                }`}
              >
                <p className="leading-relaxed">{m.content}</p>

                {m.quote && (
                  <QuoteCard
                    quote={m.quote}
                    isCurrentUserSender={isMe}
                    onAccept={async () => {
                      if (m.quote) {
                        await dealsApi.acceptQuote(dealId, m.quote.id);
                        if (onQuoteAccepted) onQuoteAccepted();
                        const updated = await dealsApi.getMessages(dealId);
                        setMessages(updated);
                      }
                    }}
                  />
                )}

                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                    isMe ? 'text-emerald-200' : 'text-stone-400'
                  }`}
                >
                  <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {m.isOptimistic ? (
                    <Clock className="w-2.5 h-2.5" />
                  ) : isMe ? (
                    <CheckCheck className="w-3 h-3 text-emerald-300" />
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 bg-stone-50 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message, propose terms, or ask for lab report..."
          className="flex-1 px-3.5 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs text-stone-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="p-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-lg transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quote Proposition Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-stone-900 max-w-sm w-full p-5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">Propose Negotiated Quote</h3>
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Offered Price / MT (₹)</label>
              <input
                type="number"
                value={quotePrice}
                onChange={(e) => setQuotePrice(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Quantity (Metric Tons)</label>
              <input
                type="number"
                value={quoteQuantity}
                onChange={(e) => setQuoteQuantity(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 dark:text-stone-300">Commercial Notes</label>
              <textarea
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder="e.g. Rate includes weighbridge fee and loading"
                rows={2}
                className="w-full mt-1 px-3 py-1.5 border rounded-lg text-xs dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendQuote}
                className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-bold"
              >
                Send Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
