import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send, ShieldCheck, Users } from 'lucide-react';
import { Group, User } from '../types';
import { appendGroupChatMessage, ensureGroupChatRoom, getGroupChatStats, listGroupChatMessages, subscribeGroupChat } from '../lib/groupChatService';

interface GroupChatPanelProps {
  currentUser: User | null;
  users: User[];
  groups?: Group[];
  isAdminMode?: boolean;
}

export default function GroupChatPanel({ currentUser, users, groups = [], isAdminMode = false }: GroupChatPanelProps) {
  const isAdminUser = currentUser?.role === 'admin';
  const adminGroupOptions = useMemo(
    () => groups.filter(group => Boolean(group?.id)).map(group => ({ id: group.id, name: group.name })),
    [groups]
  );

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  useEffect(() => {
    if (!isAdminUser && !isAdminMode) {
      setSelectedGroupId(currentUser?.group_id || '');
      return;
    }

    if (adminGroupOptions.length === 0) {
      setSelectedGroupId('');
      return;
    }

    if (!selectedGroupId || !adminGroupOptions.some(group => group.id === selectedGroupId)) {
      setSelectedGroupId(adminGroupOptions[0].id);
    }
  }, [adminGroupOptions, currentUser?.group_id, isAdminMode, isAdminUser, selectedGroupId]);

  const adminChatActive = isAdminMode || isAdminUser;
  const effectiveGroupId = adminChatActive ? (selectedGroupId || currentUser?.group_id || '') : (currentUser?.group_id || '');
  const effectiveGroupName = adminChatActive
    ? (groups.find(group => group.id === effectiveGroupId)?.name || 'چت گروهی')
    : (currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'گروه تیم');

  const memberIds = useMemo(() => {
    if (!effectiveGroupId) return [];
    return users.filter(user => user.group_id === effectiveGroupId).map(user => user.id);
  }, [effectiveGroupId, users]);

  const room = useMemo(() => {
    if (!effectiveGroupId) return null;
    return ensureGroupChatRoom(effectiveGroupId, effectiveGroupName, memberIds);
  }, [effectiveGroupId, effectiveGroupName, memberIds]);

  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!room) return;
    setMessages(listGroupChatMessages(room.id));
    const unsub = subscribeGroupChat(room.id, setMessages);
    return () => unsub();
  }, [room]);

  const stats = room ? getGroupChatStats(effectiveGroupId, users) : { totalMessages: 0, activeMembers: 0, engagementScore: 0 };

  if (!currentUser || !effectiveGroupId || !room) return null;

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
    <div className="fixed bottom-24 left-3 sm:left-6 z-40 w-[min(92vw,360px)] overflow-hidden rounded-[22px] border border-cyan-500/30 bg-[#070d1f]/90 backdrop-blur-2xl shadow-[0_0_35px_rgba(34,211,238,0.18)]">
      <div className="flex items-center justify-between border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.25)]">
            <MessageCircle size={16} />
          </span>
          <div className="min-w-0">
            <div className="text-[11px] font-black text-white">چت گروهی</div>
            <div className="truncate text-[10px] text-slate-400">{room.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-300">
          <div className="flex items-center gap-1 rounded-full border border-cyan-500/20 bg-slate-900/70 px-1.5 py-0.5">
            <Users size={11} /> {stats.activeMembers}
          </div>
          <div className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-slate-900/70 px-1.5 py-0.5">
            <ShieldCheck size={11} /> {stats.engagementScore}%
          </div>
        </div>
      </div>

      {isAdminMode && adminGroupOptions.length > 0 && (
        <div className="border-b border-slate-800 bg-slate-950/80 px-3 py-2">
          <label className="sr-only" htmlFor="group-chat-select">انتخاب گروه</label>
          <select
            id="group-chat-select"
            value={selectedGroupId}
            onChange={(event) => setSelectedGroupId(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-100 outline-none focus:border-cyan-500"
          >
            {adminGroupOptions.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="max-h-[260px] space-y-2 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_40%)] p-3">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-3 text-center text-[11px] leading-6 text-slate-400">
            پیامی برای گروه شما ثبت نشده است؛ اولین پیام را ارسال کنید.
          </div>
        ) : (
          messages.map(message => {
            const isMine = message.user_id === currentUser.id;
            return (
              <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl border p-2.5 ${isMine ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/15 to-sky-500/5' : 'border-slate-700 bg-slate-900/80'}`}
                >
                  <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-bold text-slate-200">{message.user_name}</span>
                    <span className="text-slate-500">{new Date(message.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] leading-6 text-slate-200 whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-slate-800 bg-slate-950/80 p-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(34,211,238,0.15)]"
        />
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.45)] transition hover:brightness-110"
          aria-label="ارسال پیام"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
