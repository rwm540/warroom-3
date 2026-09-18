import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, ShieldCheck, Users } from 'lucide-react';
import { User } from '../types';
import { appendGroupChatMessage, ensureGroupChatRoom, getGroupChatStats, listGroupChatMessages, subscribeGroupChat } from '../lib/groupChatService';

interface GroupChatPanelProps {
  currentUser: User | null;
  users: User[];
}

export default function GroupChatPanel({ currentUser, users }: GroupChatPanelProps) {
  const groupId = currentUser?.group_id || '';
  const memberIds = useMemo(() => {
    if (!groupId) return [];
    return users.filter(user => user.group_id === groupId).map(user => user.id);
  }, [groupId, users]);

  const room = useMemo(() => {
    if (!groupId) return null;
    const groupName = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'گروه تیم';
    return ensureGroupChatRoom(groupId, groupName, memberIds);
  }, [groupId, currentUser, memberIds]);

  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!room) return;
    setMessages(listGroupChatMessages(room.id));
    const unsub = subscribeGroupChat(room.id, setMessages);
    return () => unsub();
  }, [room]);

  const stats = room ? getGroupChatStats(groupId, users) : { totalMessages: 0, activeMembers: 0, engagementScore: 0 };

  if (!currentUser || !groupId || !room) return null;

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    appendGroupChatMessage({
      roomId: room.id,
      groupId: room.group_id,
      userId: currentUser.id,
      userName: `${currentUser.first_name} ${currentUser.last_name}`,
      avatarUrl: currentUser.avatar_url,
      text,
      isSystem: false,
    });

    setDraft('');
  };

  return (
    <div className="fixed bottom-24 left-3 sm:left-6 z-40 w-[min(92vw,360px)] rounded-2xl border border-cyan-500/40 bg-slate-950/90 backdrop-blur-xl shadow-[0_0_25px_rgba(34,211,238,0.18)]">
      <div className="flex items-center justify-between border-b border-cyan-500/20 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
            <MessageCircle size={16} />
          </span>
          <div>
            <div className="text-xs font-black text-white">چت گروهی</div>
            <div className="text-[10px] text-slate-400">{room.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-300">
          <div className="flex items-center gap-1"><Users size={12} /> {stats.activeMembers}</div>
          <div className="flex items-center gap-1"><ShieldCheck size={12} /> {stats.engagementScore}%</div>
        </div>
      </div>

      <div className="max-h-[260px] space-y-2 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-3 text-center text-[11px] text-slate-400">
            پیامی برای گروه شما ثبت نشده است؛ اولین پیام را ارسال کنید.
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`rounded-2xl border p-2.5 ${message.user_id === currentUser.id ? 'ml-2 border-cyan-500/40 bg-cyan-500/10' : 'mr-2 border-slate-700 bg-slate-900/80'}`}
            >
              <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                <span className="font-bold text-slate-200">{message.user_name}</span>
                <span className="text-slate-500">{new Date(message.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-[11px] leading-6 text-slate-200 whitespace-pre-wrap">{message.text}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-800 p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.45)] transition hover:brightness-110"
          aria-label="ارسال پیام"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
