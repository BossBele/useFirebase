import getDocuments from "./getDocuments";
import getDocumentsCount from "./getDocumentsCount";
import type { BaseDocument, DocumentModelInstance, GenericObject } from "../../../web/database/firestore/types";
import { createModel } from "./Model";
import type { IAdminCollectionModel, IDocumentsQueryOptions } from "./types";

class CollectionModel<T> implements IAdminCollectionModel<T> {
  [key: string]: any;
  private name: string;
  private originalName: string;
  private schema: Partial<T>;
  private constraints?: IDocumentsQueryOptions;
  private documents: GenericObject[];
  private count: number;
  private hasBeenCounted?: boolean;
  private hasBeenFetched?: boolean;

  constructor(name: string, schema: Partial<T>) {
    this.name = name;
    this.originalName = name;
    this.schema = schema;
    this.count = 0;
    this.constraints = {};
    this.hasBeenFetched = false;
    this.documents = [];
  }

  private async obtainCount(): Promise<number> {
    const count = await getDocumentsCount(this.name, this.constraints);
    this.setCount(count);
    this.hasBeenCounted = true;
    return count;
  }

  private async obtainDocuments(): Promise<GenericObject[]> {
    const documents = await getDocuments(this.name, this.constraints);
    this.setDocuments(documents);
    this.hasBeenFetched = true;
    return documents;
  }

  public getName(): string {
    return this.name;
  }

  public setSubcollectionName(name: string): void {
    this.name = `${this.originalName}/${name}`.replace('//', '/');
  }

  public appendSubcollectionName(name: string): void {
    this.name += `/${name}`.replace('//', '/');
  }

  public getSchema(): Partial<T> {
    return this.schema;
  }

  public getConstraints(): IDocumentsQueryOptions {
    return this.constraints;
  }

  public withConstraints(constraints: IDocumentsQueryOptions): this {
    this.constraints = constraints;
    return this;
  }

  public whereBy(constraint: IDocumentsQueryOptions['whereBy']): this {
    this.constraints.whereBy = constraint;
    return this;
  }

  public whereOr(constraint: IDocumentsQueryOptions['whereOr']): this {
    this.constraints.whereOr = constraint;
    return this;
  }

  public orderBy(constraint: IDocumentsQueryOptions['orderBy']): this {
    this.constraints.orderBy = constraint;
    return this;
  }

  public limit(constraint: IDocumentsQueryOptions['limit']): this {
    this.constraints.limit = constraint;
    return this;
  }

  public select(constraint: IDocumentsQueryOptions['select']): this {
    this.constraints.select = constraint;
    return this;
  }

  /**
   * @description Enables fetching subcollections of the documents
   */
  public withSubcollections(): this {
    this.constraints.withSubcollections = true;
    return this;
  }

  public async getCount(): Promise<number> {
    if (!this.hasBeenCounted) {
      return await this.obtainCount();
    }
    return this.count;
  }

  private setCount(count: number): void {
    this.count = count;
  }

  public async getDocuments(): Promise<GenericObject[]> {
    if (!this.hasBeenFetched) {
      return await this.obtainDocuments();
    }
    return this.documents;
  }

  public Manager<T>(): DocumentModelInstance<BaseDocument & Partial<T>> {
    return createModel(this.name, this.schema) as unknown as DocumentModelInstance<BaseDocument & Partial<T>>;
  }

  private setDocuments(documents: GenericObject[]): void {
    this.documents = documents;
  }
}

/**
 * @example
 * const Users = createRepository('users', {
 *   age: 25,
 *   name: "John Doe",
 *   isActive: true,
 *   address: {
 *     city: "New York",
 *     zip: 10001,
 *   },
 * });
 * @param name - The name of the collection eg. 'users' or 'posts/postId/comments'
 * @param schema - A javascript object that represents the schema of the collection
 * @returns A new class that extends CollectionModel
 */
function createRepository<T>(name: string, schema: Partial<T>): new () => IAdminCollectionModel<T> {
  return class Repository extends CollectionModel<T> {
    constructor() {
      super(name, schema);
      return new CollectionModel<T>(name, schema);
    }
  };
}

export { 
  CollectionModel,
  type IDocumentsQueryOptions,
  createRepository,
};
