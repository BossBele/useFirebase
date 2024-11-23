import { OrderByDirection, WhereFilterOp } from "firebase/firestore";

export type PersistenceType = 'context' | 'local' | 'session' | 'none';
export enum PersistenceTypes {
  CONTEXT_API = 'context',
  LOCAL_STORAGE = 'local',
  SESSION_STORAGE = 'session',
  NONE = 'none'
}

export interface IUseCollection {
  collection: string,
  constraints?: IGetDocumentsOptions,
  enabled: boolean,
  persistence?: PersistenceType,
  withRealtimeUpdates: boolean,
}

export type GenericObject = { [key: string]: any };

export type retrieveItem = (queryKey: string) => any;
export type storeItem = (queryKey: string, item: any) => void;

export interface IUseFirestore {
  retrieveItem: (queryKey: string) => void,
  storeItem: storeItem,
  store: { [key: string]: any },
}

export type whereBy = {
  field: string,
  operator: WhereFilterOp,
  value: any
};

export type whereOr = whereBy;

export type orderBy = {
  field: string,
  direction: OrderByDirection,
};

export interface IGetDocumentsOptions {
  whereBy: whereBy[],
  whereOr: whereOr[],
  orderBy: orderBy[],
  limit: number,
}

export interface IUseCount {
  collection: string,
  constraints?: IGetDocumentsOptions,
  enabled: boolean,
}
