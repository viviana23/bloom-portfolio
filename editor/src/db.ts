/**
 * Guardado automático en el navegador (IndexedDB): el avance y las fotos
 * quedan guardados aunque se cierre la pestaña. No sale de su computadora.
 */
const DB_NAME = "bloom-editor";
const STORE = "kv";

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const db = {
  get: <T>(key: string) => run<T | undefined>("readonly", (s) => s.get(key) as IDBRequest<T | undefined>),
  set: (key: string, value: unknown) => run("readwrite", (s) => s.put(value, key)),
  del: (key: string) => run("readwrite", (s) => s.delete(key)),
  keys: () => run<IDBValidKey[]>("readonly", (s) => s.getAllKeys()),
};
