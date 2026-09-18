import { GroupChatMessage, GroupChatRoom, User } from '../types';

const CHAT_STORAGE_KEY = 'warroom_group_chat_store_v1';
const CHAT_EVENT_NAME = 'warroom_group_chat_updated';

function readStore(): Record<string, { room: GroupChatRoom; messages: GroupChatMessage[] }> {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, { room: GroupChatRoom; messages: GroupChatMessage[] }>) {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent(CHAT_EVENT_NAME, { detail: store }));
  } catch {
    // localStorage may be unavailable in some contexts; fail quietly.
  }
}

export function ensureGroupChatRoom(groupId: string, groupName: string, memberIds: string[]): GroupChatRoom {
  const store = readStore();
  const key = groupId || 'default-group';
  const existing = store[key]?.room;

  if (existing) {
    const nextRoom = { ...existing, name: groupName || existing.name, member_ids: Array.from(new Set(memberIds.length ? memberIds : existing.member_ids)) };
    store[key] = { ...store[key], room: nextRoom };
    writeStore(store);
    return nextRoom;
  }

  const room: GroupChatRoom = {
    id: `room_${groupId || Date.now()}`,
    group_id: groupId,
    name: groupName || 'گروه تیم',
    member_ids: Array.from(new Set(memberIds)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store[key] = { room, messages: [] };
  writeStore(store);
  return room;
}

export function listGroupChatMessages(roomId: string): GroupChatMessage[] {
  const store = readStore();
  const roomEntry = Object.values(store).find(entry => entry?.room?.id === roomId);
  return roomEntry?.messages ?? [];
}

export function listAllGroupChats(): Array<{ room: GroupChatRoom; messages: GroupChatMessage[] }> {
  const store = readStore();
  return Object.values(store)
    .filter(Boolean)
    .map(entry => ({
      room: entry.room,
      messages: Array.isArray(entry.messages) ? entry.messages : [],
    }))
    .sort((a, b) => new Date(b.room.updated_at).getTime() - new Date(a.room.updated_at).getTime());
}

export function deleteGroupChatMessage(roomId: string, messageId: string): boolean {
  const store = readStore();
  const key = Object.keys(store).find(item => store[item]?.room?.id === roomId);
  if (!key) return false;

  const messages = (store[key]?.messages ?? []).filter(message => message.id !== messageId);
  store[key] = { ...store[key], room: { ...store[key].room, updated_at: new Date().toISOString() }, messages };
  writeStore(store);
  return true;
}

export function appendGroupChatMessage(payload: {
  roomId: string;
  groupId: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  text: string;
  isSystem?: boolean;
}): GroupChatMessage | null {
  const trimmed = payload.text?.trim();
  if (!payload.roomId || !trimmed) return null;

  const store = readStore();
  const roomEntry = Object.values(store).find(entry => entry?.room?.id === payload.roomId);
  const room = roomEntry?.room ?? ensureGroupChatRoom(payload.groupId, 'گروه تیم', [payload.userId]);

  const newMessage: GroupChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    room_id: room.id,
    group_id: payload.groupId || room.group_id,
    user_id: payload.userId,
    user_name: payload.userName,
    avatar_url: payload.avatarUrl,
    text: trimmed,
    created_at: new Date().toISOString(),
    is_system: Boolean(payload.isSystem),
  };

  const nextMessages = [...(roomEntry?.messages ?? []), newMessage].slice(-200);
  const updatedStore = { ...store };
  const targetKey = Object.keys(store).find(key => store[key]?.room?.id === payload.roomId) || room.group_id || 'default-group';
  updatedStore[targetKey] = { room: { ...room, updated_at: new Date().toISOString() }, messages: nextMessages };
  writeStore(updatedStore);
  return newMessage;
}

export function getGroupChatStats(groupId: string, users: User[] = []): {
  totalMessages: number;
  activeMembers: number;
  engagementScore: number;
} {
  const store = readStore();
  const entriesForGroup = Object.values(store).filter(entry => entry?.room?.group_id === groupId);
  const allMessages = entriesForGroup.flatMap(entry => entry.messages ?? []);
  const memberIds = Array.from(new Set(entriesForGroup.flatMap(entry => entry.room.member_ids ?? [])));
  const activeMembers = memberIds.filter(id => users.some(user => user.id === id)).length;
  const totalMessages = allMessages.length;
  const engagementScore = Math.min(100, Math.round((totalMessages * 2 + activeMembers * 12) / 2));

  return { totalMessages, activeMembers, engagementScore };
}

export function subscribeGroupChat(roomId: string, onChange: (messages: GroupChatMessage[]) => void): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent).detail as Record<string, { room: GroupChatRoom; messages: GroupChatMessage[] }> | undefined;
    if (!detail) return;
    const roomEntry = Object.values(detail).find(entry => entry?.room?.id === roomId);
    if (roomEntry) onChange(roomEntry.messages ?? []);
  };

  window.addEventListener(CHAT_EVENT_NAME, listener);
  onChange(listGroupChatMessages(roomId));

  return () => {
    window.removeEventListener(CHAT_EVENT_NAME, listener);
  };
}
