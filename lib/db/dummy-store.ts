/**
 * In-memory fallback store. Used when MongoDB is not configured.
 * DO NOT use in production — data is lost on server restart.
 */

import type { ScanResult, ChatMessage } from "@/types";

interface DummyUser {
  id: string;
  fullName: string;
  email: string;
  password: string; // hashed
  createdAt: string;
}

class UserStore {
  private users = new Map<string, DummyUser>();

  create(data: Omit<DummyUser, "id" | "createdAt">): DummyUser {
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user: DummyUser = { ...data, id, createdAt: new Date().toISOString() };
    this.users.set(id, user);
    return user;
  }

  findByEmail(email: string): DummyUser | undefined {
    for (const u of this.users.values()) {
      if (u.email === email) return u;
    }
    return undefined;
  }

  findById(id: string): DummyUser | undefined {
    return this.users.get(id);
  }
}

class ScanStore {
  private scans = new Map<string, ScanResult[]>();

  create(userId: string, scan: Omit<ScanResult, "id" | "userId" | "createdAt">): ScanResult {
    const list = this.scans.get(userId) || [];
    const newScan: ScanResult = {
      ...scan,
      id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newScan);
    this.scans.set(userId, list);
    return newScan;
  }

  list(userId: string): ScanResult[] {
    return this.scans.get(userId) || [];
  }

  getById(scanId: string, userId: string): ScanResult | undefined {
    const scans = this.scans.get(userId) || [];
    return scans.find((s) => s.id === scanId);
  }
}

class ChatStore {
  private chats = new Map<string, ChatMessage[]>();

  append(userId: string, message: Omit<ChatMessage, "id" | "createdAt">): ChatMessage {
    const list = this.chats.get(userId) || [];
    const msg: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    list.push(msg);
    this.chats.set(userId, list);
    return msg;
  }

  list(userId: string): ChatMessage[] {
    return this.chats.get(userId) || [];
  }

  clear(userId: string): void {
    this.chats.delete(userId);
  }
}

// Use globalThis to persist across hot reloads in dev
const g = globalThis as unknown as {
  __dummyUserStore?: UserStore;
  __dummyScanStore?: ScanStore;
  __dummyChatStore?: ChatStore;
};

export const dummyUserStore = g.__dummyUserStore ?? (g.__dummyUserStore = new UserStore());
export const dummyScanStore = g.__dummyScanStore ?? (g.__dummyScanStore = new ScanStore());
export const dummyChatStore = g.__dummyChatStore ?? (g.__dummyChatStore = new ChatStore());
