import { createContext } from 'react';
import { PersistenceTypes } from "./database/firestore/types";

export function hasStorageSupport(): boolean {
  return typeof Storage !== 'undefined';
}

export function hasContextSupport(): boolean {
  return typeof createContext === 'function';
}

export function checkPersistenceSupport(persistence) {
  switch (persistence) {
    case PersistenceTypes.LOCAL_STORAGE:
    case PersistenceTypes.SESSION_STORAGE:
      if (!hasStorageSupport()) {
        throw new Error('Web Storage is not supported');
      }
      break;
    case PersistenceTypes.CONTEXT_API:
      if (!hasContextSupport()) {
        throw new Error('Context API is not supported');
      }
      break;
    default:
        break;
  }
}

export function getStorage(queryKey: string): any {
  const item = localStorage.getItem(queryKey);
  return JSON.parse(item);
}

export function setStorage(queryKey: string, item: any): void {
  localStorage.setItem(queryKey, JSON.stringify(item));
}

export function getSessionItem(queryKey: string): any {
  const item = sessionStorage.getItem(queryKey);
  return JSON.parse(item);
}
  
export function setSessionItem(queryKey: string, item: any): void {
  sessionStorage.setItem(queryKey, JSON.stringify(item));
}
  