import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, GripVertical, MessageCircle, Pencil, Send, ShieldCheck, Trash2, Users, X } from 'lucide-react';
import { Group, User } from '../types';
import { appendGroupChatMessage, deleteGroupChatMessage, editGroupChatMessage, ensureGroupChatRoom, getGroupChatStats, listGroupChatMessages, subscribeGroupChat } from '../lib/groupChatService';

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
    : (groups.find(group => group.id === effectiveGroupId)?.name || 'گروه تیم');

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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 360, height: 470 });
  const interactionState = useRef<{
    type: 'drag' | 'resize';
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startWidth: number;
    startHeight: number;
    edge?: 'right' | 'left' | 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  } | null>(null);

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

  const startDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, input, textarea, select, a')) return;
    const panel = event.currentTarget.parentElement;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    setPosition({ left: rect.left, top: rect.top });
    interactionState.current = {
      type: 'drag',
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      startWidth: rect.width,
      startHeight: rect.height,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const startResize = (event: React.PointerEvent<HTMLDivElement>, edge: 'right' | 'left' | 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => {
    event.preventDefault();
    event.stopPropagation();
    const panel = event.currentTarget.parentElement;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    setPosition({ left: rect.left, top: rect.top });
    interactionState.current = {
      type: 'resize',
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      startWidth: rect.width,
      startHeight: rect.height,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const interaction = interactionState.current;
      if (!interaction) return;
      if (interaction.type === 'drag') {
        const left = Math.max(8, Math.min(window.innerWidth - interaction.startWidth - 8, interaction.startLeft + event.clientX - interaction.startX));
        const top = Math.max(8, Math.min(window.innerHeight - 80, interaction.startTop + event.clientY - interaction.startY));
        setPosition({ left, top });
        return;
      }
      const edge = interaction.edge || 'bottom-right';
      const resizesLeft = edge === 'left' || edge === 'top-left' || edge === 'bottom-left';
      const resizesRight = edge === 'right' || edge === 'top-right' || edge === 'bottom-right';
      const resizesTop = edge === 'top' || edge === 'top-left' || edge === 'top-right';
      const resizesBottom = edge === 'bottom' || edge === 'bottom-left' || edge === 'bottom-right';
      const maxWidth = window.innerWidth - 16;
      const maxHeight = window.innerHeight - 16;
      const pointerRight = event.clientX;
      const pointerBottom = event.clientY;
      const fixedRight = interaction.startLeft + interaction.startWidth;
      const fixedBottom = interaction.startTop + interaction.startHeight;
      const nextLeft = resizesLeft ? Math.max(8, Math.min(fixedRight - 280, pointerRight)) : interaction.startLeft;
      const nextTop = resizesTop ? Math.max(8, Math.min(fixedBottom - 220, pointerBottom)) : interaction.startTop;
      const nextWidth = resizesLeft
        ? Math.max(280, Math.min(maxWidth, fixedRight - nextLeft))
        : resizesRight ? Math.max(280, Math.min(maxWidth, pointerRight - interaction.startLeft)) : interaction.startWidth;
      const nextHeight = resizesTop
        ? Math.max(220, Math.min(maxHeight, fixedBottom - nextTop))
        : resizesBottom ? Math.max(220, Math.min(maxHeight, pointerBottom - interaction.startTop)) : interaction.startHeight;
      setPosition({
        left: Math.max(8, Math.min(window.innerWidth - nextWidth - 8, nextLeft)),
        top: Math.max(8, Math.min(window.innerHeight - nextHeight - 8, nextTop)),
      });
      setSize({ width: nextWidth, height: nextHeight });
    };
    const stop = () => { interactionState.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
  }, []);

  return (
    <div className={`${position ? 'fixed' : 'fixed bottom-24 left-3 sm:left-6'} z-40 overflow-visible rounded-[22px] border border-cyan-500/30 bg-[#070d1f]/90 backdrop-blur-2xl shadow-[0_0_35px_rgba(34,211,238,0.18)]`} style={{ ...(position ? { left: position.left, top: position.top } : {}), width: `min(${size.width}px, 92vw)`, height: size.height }}>
      <div onPointerDown={startDragging} className="flex h-14 cursor-grab touch-none items-center justify-between overflow-hidden rounded-t-[22px] border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-transparent px-3 py-2.5 active:cursor-grabbing">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical size={15} className="shrink-0 text-cyan-400/70" aria-label="جابجایی چت" />
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

      <div onPointerDown={startDragging} className="h-[calc(100%-110px)] space-y-2 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_40%)] p-3">
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
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{new Date(message.created_at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMine && (
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => { setEditingMessageId(message.id); setEditingText(message.text); }} className="rounded-md p-1 text-slate-500 transition hover:bg-cyan-500/15 hover:text-cyan-300" title="ویرایش پیام من" aria-label="ویرایش پیام من"><Pencil size={12} /></button>
                          <button type="button" onClick={() => deleteGroupChatMessage(room.id, message.id, currentUser.id)} className="rounded-md p-1 text-slate-500 transition hover:bg-rose-500/15 hover:text-rose-300" title="حذف پیام من" aria-label="حذف پیام من"><Trash2 size={12} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingMessageId === message.id ? (
                    <form onSubmit={(event) => { event.preventDefault(); if (editGroupChatMessage(room.id, message.id, currentUser.id, editingText)) setEditingMessageId(null); }} className="space-y-2">
                      <textarea value={editingText} onChange={event => setEditingText(event.target.value)} autoFocus className="w-full rounded-lg border border-cyan-500/40 bg-slate-950 px-2 py-1.5 text-[11px] leading-6 text-white outline-none" rows={2} />
                      <div className="flex justify-end gap-1"><button type="submit" className="rounded-lg bg-cyan-400 p-1.5 text-slate-950" title="ذخیره ویرایش"><Check size={13} /></button><button type="button" onClick={() => setEditingMessageId(null)} className="rounded-lg bg-slate-800 p-1.5 text-slate-300" title="لغو"><X size={13} /></button></div>
                    </form>
                  ) : <p className="text-[11px] leading-6 text-slate-200 whitespace-pre-wrap">{message.text}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={sendMessage} className="flex h-14 items-center gap-2 rounded-b-[22px] border-t border-slate-800 bg-slate-950/80 p-3">
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

      <div onPointerDown={(event) => startResize(event, 'right')} className="absolute -right-1 top-8 h-[calc(100%-64px)] w-2 cursor-ew-resize" title="تغییر عرض چت" />
      <div onPointerDown={(event) => startResize(event, 'left')} className="absolute -left-1 top-8 h-[calc(100%-64px)] w-2 cursor-ew-resize" title="تغییر عرض چت" />
      <div onPointerDown={(event) => startResize(event, 'bottom')} className="absolute -bottom-1 left-8 h-2 w-[calc(100%-64px)] cursor-ns-resize" title="تغییر ارتفاع چت" />
      <div onPointerDown={(event) => startResize(event, 'top')} className="absolute -top-1 left-8 h-2 w-[calc(100%-64px)] cursor-ns-resize" title="تغییر ارتفاع چت" />
      <div onPointerDown={(event) => startResize(event, 'top-left')} className="absolute -left-1 -top-1 h-5 w-5 cursor-nwse-resize rounded-tl-xl" title="تغییر اندازه چت" />
      <div onPointerDown={(event) => startResize(event, 'top-right')} className="absolute -right-1 -top-1 h-5 w-5 cursor-nesw-resize rounded-tr-xl" title="تغییر اندازه چت" />
      <div onPointerDown={(event) => startResize(event, 'bottom-left')} className="absolute -bottom-1 -left-1 h-5 w-5 cursor-nesw-resize rounded-bl-xl" title="تغییر اندازه چت" />
      <div onPointerDown={(event) => startResize(event, 'bottom-right')} className="absolute -bottom-1 -right-1 h-5 w-5 cursor-nwse-resize rounded-br-xl" title="تغییر اندازه چت" />
    </div>
  );
}
