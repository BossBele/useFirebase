import { Timestamp } from "firebase/firestore";
import setDocument from "./setDocument";
import type { BaseDocument, DocumentModelInstance, GenericObject, IDocumentModel } from "./types";

// Type guard for Firestore timestamp
function isFirestoreTimestamp(value: any): value is Timestamp {
  return value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value;
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
};