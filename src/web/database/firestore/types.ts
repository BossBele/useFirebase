import { FieldValue, OrderByDirection, Timestamp, WhereFilterOp } from "firebase/firestore";

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
  enabled?: boolean,
  persistence?: PersistenceType,
  withRealtimeUpdates?: boolean,
  withPagination?: boolean,
}

export interface IUseCollectionValue {
  isFetching: boolean,
  isFetched: boolean,
  records: GenericObject[]|null,
}

export interface IUseDocument {
  collection: string,
  documentId: string,
  enabled?: boolean,
  withRealtimeUpdates?: boolean,
}

export interface IUseDocumentValue {
  isFetching: boolean,
  isFetched: boolean,
  record: GenericObject|null,
}

export type GenericObject = { [key: string]: any };

export type retrieveItem = (queryKey: string) => any;
export type storeItem = (queryKey: string, item: any) => void;

export interface IUseFirestore {
  retrieveItem: (queryKey: string) => void,
  storeItem: storeItem,
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
  whereBy?: whereBy[],
  whereOr?: whereOr[],
  orderBy?: orderBy[],
  limit?: number,
}

export interface IUseCount {
  collection: string,
  constraints?: IGetDocumentsOptions,
  enabled: boolean,
}

export interface IUseCountValue {
  count: number,
  isCounted: boolean,
  isEmpty: boolean,
}

export type setDocument = (collection: string, documentId: string, form: GenericObject) => Promise<string>;
export type addDocument = (collection: string, form: GenericObject) => Promise<string>;

// Base document interface that all Firestore docs should extend
export interface BaseDocument {
  id: string,
  createdAt?: Timestamp,
  updatedAt?: Timestamp,
}

export type ObjectMappings<T> = BaseDocument & {
  [K in keyof T]: T[K];
}

export interface BaseDocumentModel {
  /**
   * Gets the collection name of the document
   */
  getCollection(): string,
  /**
   * Gets the id of the document
   */
  getId(): string,
  /**
   * Sets the id for the document
   * @param value - The id to set for the document
   */
  setId(value: string): void,
  /**
   * Sets the document data
   * @param data - The data to set for the document
   */
  set(data: GenericObject): void,
  /**
   * Gets the document data as a JSON object
   */
  get(): Promise<GenericObject>,
  /**
   * Gets the changes made to the document as JSON object
   */
  getChanges(): Partial<GenericObject>,
  /**
   * Resets the changes made to the document
   */
  resetChanges(): void,
  /**
   * Checks if any of the document fields have changed
   */
  hasChanged(): boolean,
  /**
   * Checks if the specified fields have changed
   * @param fields - List of fields to check if they have changed
   */
  hasFieldsChanged(...fields: string[]): boolean,
  /**
   * Commits the changes to the Firestore document
   * Adds a new document if the document does not exist, updates if exists
   * If id was not set, a document with random firestore Id be created
   * @returns - The updated document data or false if no changes were made
   */
  commit(): Promise<string|false>,
  /**
   * Deletes the document from the Firestore
   */
  delete(): Promise<void>,
  /**
   * Converts the document data to a JSON object
   */
  toJSON(): GenericObject,
  /**
   * Converts the document data to a JSON string
   */
  toString(): string,
}

export type IDocumentModel<T> = BaseDocumentModel & Omit<ObjectMappings<T>, 'id'>;
export type IDocumentModelClass = BaseDocumentModel & GenericObject;

export type DocumentModelInstance<T extends BaseDocument> = {
  [K in keyof T]: T[K];
} & {
  [key: string]: FieldValue; // Allow additional fields with `FieldValue` type.
} & IDocumentModel<T>;

export interface ICollectionModel<T> {
  getName(): string,
  setSubcollectionName(name: string): void,
  getSchema(): GenericObject,
  getConstraints(): IGetDocumentsOptions,
  withConstraints(constraints: IGetDocumentsOptions): this,
  whereBy(constraint: IGetDocumentsOptions['whereBy']): this,
  whereOr(constraint: IGetDocumentsOptions['whereOr']): this,
  orderBy(constraint: IGetDocumentsOptions['orderBy']): this,
  limit(constraint: IGetDocumentsOptions['limit']): this,
  getCount(): Promise<number>,
  getDocuments(): Promise<GenericObject[]>,
  Manager(): DocumentModelInstance<BaseDocument & Partial<T>>,
}
