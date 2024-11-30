import { Timestamp, FieldValue } from "firebase/firestore";
import setDocument from "./setDocument";
import { GenericObject } from "./types";

// Base document interface that all Firestore docs should extend
interface BaseDocument {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Type guard for Firestore timestamp
function isFirestoreTimestamp(value: any): value is Timestamp {
  return value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value;
}

// Interface for the class implementation
interface IDocumentModel<T extends BaseDocument> {
  /**
   * Gets the collection name of the document
   */
  getCollection(): string;
  /**
   * Gets the id of the document
   */
  getId(): string;
  /**
   * Sets the id for the document
   * @param value - The id to set for the document
   */
  setId(value: string): void;
  /**
   * Gets the changes made to the document as JSON object
   */
  getChanges(): Partial<T>;
  /**
   * Resets the changes made to the document
   */
  resetChanges(): void;
  /**
   * Checks if any of the document fields have changed
   */
  hasChanged(): boolean;
  /**
   * Checks if the specified fields have changed
   * @param fields - List of fields to check if they have changed
   */
  hasFieldsChanged(...fields: string[]): boolean;
  /**
   * Commits the changes to the Firestore document
   * Adds a new document if the document does not exist, updates if exists
   * If id was not set, a document with random firestore Id be created
   * @returns - The updated document data or false if no changes were made
   */
  commit(): Promise<GenericObject|false>;
  /**
   * Converts the document data to a JSON object
   */
  toJSON(): GenericObject;
  /**
   * Converts the document data to a JSON string
   */
  toString(): string;
}

class DocumentModel<T extends BaseDocument> implements IDocumentModel<T> {
  [key: string]: any;
  private collection: string;
  private id?: string;
  private data: GenericObject;
  private schema: Partial<T>;
  private changedFields: Set<string>;

  constructor(collection: string, structure: Partial<T>, data?: GenericObject) {
    const { id, ...rest } = structure;
    const schema = rest as Partial<T>;

    this.collection = collection;
    this.id = id;
    this.data = data ?? null;
    this.schema = schema;
    this.changedFields = new Set();
    this.generateAccessors();
  }

  private isExistentField(key: string|number|symbol): boolean {
    return typeof this.schema[key] !== 'undefined';
  }

  private generateAccessors() {
    for (const key in this.schema) {
      if (Object.prototype.hasOwnProperty.call(this.schema, key)) {
        Object.defineProperty(this, key, {
          get: () => this.getValue(key),
          set: (value) => this.setValue(key, value),
          enumerable: true,
          configurable: true
        });
      }
    }
  }

  private getValue<K extends keyof T>(key: string): T[K] | undefined {
    const value = this.data[key];

    // if field does not exist in schema, throw an error
    if (this.isExistentField(key)) {
      throw new Error(`Field '${key as string}' does not exist in the schema`);
    }

    if (isFirestoreTimestamp(value)) {
      return new Date(value.seconds * 1000) as any;
    }
    
    return value;
  }

  private setValue<K extends keyof T>(key: string, value: T[K]) {
    if (this.isExistentField(key)) {
      throw new Error(`Field '${key as string}' does not exist in the schema`);
    }
    this.data[key] = value;
    this.changedFields.add(key);
  }

  public getCollection(): string {
    return this.collection;
  }

  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }

  public getChanges(): Partial<T> {
    const changes: Partial<T> = {};
    this.changedFields.forEach((key) => {
      changes[key] = this.data[key];
    });
    return changes;
  }

  public resetChanges(): void {
    this.changedFields.clear();
  }

  public hasChanged(): boolean {
    return this.changedFields.size > 0;
  }

  public hasFieldsChanged(...fields: string[]): boolean {
    return fields.some(field => this.changedFields.has(field));
  }

  public async commit(): Promise<GenericObject|false> {
    if (!this.hasChanged()) {
      return false;
    }
    await setDocument(this.collection, this.id, this.getChanges());
    this.resetChanges();
    return this.data;
  }

  public toJSON(): GenericObject {
    return { ...this.data };
  }

  public toString(): string {
    return JSON.stringify(this.data);
  }
}

// Type for the instance with all properties
type DocumentModelInstance<T extends BaseDocument> = {
  [key: string]: FieldValue;
} & IDocumentModel<T>;

/**
 * @example
 * // Declare the JavaScript object to be used as the schema
 * const config = {
 *   age: 25,
 *   name: "John Doe",
 *   isActive: true,
 *   address: {
 *     city: "New York",
 *     zip: 10001,
 *   },
 * };
 *
 * // Usage with type suggestions
 * const User = createModel('users', config);
 *
 * // All these will have proper type suggestions
 * User.name = 'Jane Doe';  // string
 * User.age = 31;          // number
 * console.log(User.address); // object
 * console.log(User.isActive); // true
 * console.log(User.address?.city); // 'New York'
 * @param collection - Firestore collection name eg. 'users' or 'posts/postId/comments'
 * @param schema - JS object to be used to create the model schema
 * @param data - Optional data to be used to populate the model
 * @returns - A new instance of the DocumentModel class
 */
function createModel<T>(collection: string, schema: Partial<T>, data?: GenericObject): DocumentModelInstance<BaseDocument & typeof data> {
  type DataType = typeof schema;
  type DataDoc = BaseDocument & DataType;
  // interface DataDoc extends BaseDocument, DataType {}
  return new DocumentModel<DataDoc>(collection, { ...schema, id: '' }, data) as DocumentModelInstance<DataDoc>;
}

export { 
  DocumentModel, 
  createModel, 
  type DocumentModelInstance, 
  type IDocumentModel, 
  type BaseDocument 
};