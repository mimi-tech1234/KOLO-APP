import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

type QueueItem = {
  id?: number;
  endpoint: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  payload: Record<string, unknown>;
  createdAt: string;
};

const WEB_QUEUE_KEY = "kolo_offline_queue";
const isWeb = Platform.OS === "web";

let dbPromise: ReturnType<typeof SQLite.openDatabaseAsync> | null = null;
if (!isWeb) {
  dbPromise = SQLite.openDatabaseAsync("kolo_offline.db");
}

function readWebQueue(): QueueItem[] {
  if (typeof localStorage === "undefined") return [];
  const raw = localStorage.getItem(WEB_QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeWebQueue(items: QueueItem[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(WEB_QUEUE_KEY, JSON.stringify(items));
}

export async function initializeOfflineQueue() {
  if (isWeb) return;
  const db = await dbPromise!;
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export async function enqueueOfflineAction(item: QueueItem) {
  if (isWeb) {
    const queue = readWebQueue();
    queue.push(item);
    writeWebQueue(queue);
    return;
  }

  const db = await dbPromise!;
  await db.runAsync(
    "INSERT INTO sync_queue (endpoint, method, payload, created_at) VALUES (?, ?, ?, ?)",
    item.endpoint,
    item.method,
    JSON.stringify(item.payload),
    item.createdAt
  );
}

export async function getPendingCount() {
  if (isWeb) return readWebQueue().length;

  const db = await dbPromise!;
  const row = await db.getFirstAsync<{ count: number }>("SELECT COUNT(*) as count FROM sync_queue");
  return row?.count ?? 0;
}

export async function flushOfflineQueue(processor: (item: QueueItem) => Promise<void>) {
  if (isWeb) {
    const queue = readWebQueue();
    for (const item of queue) {
      await processor(item);
    }
    writeWebQueue([]);
    return;
  }

  const db = await dbPromise!;
  const rows = await db.getAllAsync<{
    id: number;
    endpoint: string;
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    payload: string;
    created_at: string;
  }>("SELECT * FROM sync_queue ORDER BY id ASC");

  for (const row of rows) {
    const parsed: QueueItem = {
      id: row.id,
      endpoint: row.endpoint,
      method: row.method,
      payload: JSON.parse(row.payload),
      createdAt: row.created_at
    };
    await processor(parsed);
    await db.runAsync("DELETE FROM sync_queue WHERE id = ?", row.id);
  }
}
