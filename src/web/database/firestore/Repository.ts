import getDocuments from "./getDocuments";
import getDocumentsCount from "./getDocumentsCount";
import { GenericObject, IGetDocumentsOptions } from "./types";
import { BaseDocument, DocumentModelInstance, createModel } from "./Model";

// Interface for the class implementation
interface ICollectionModel {
  getName(): string;
  getSchema(): GenericObject;
  getConstraints(): IGetDocumentsOptions;
  withConstraints(constraints: IGetDocumentsOptions): this;
  whereBy(constraint: IGetDocumentsOptions['whereBy']): this;
  whereOr(constraint: IGetDocumentsOptions['whereOr']): this;
  orderBy(constraint: IGetDocumentsOptions['orderBy']): this;
  limit(constraint: IGetDocumentsOptions['limit']): this;
  getCount(): Promise<number>;
  getDocuments(): Promise<GenericObject[]>;
}

class CollectionModel implements ICollectionModel {
  [key: string]: any;
  private name: string;
  private schema: GenericObject;
  private constraints?: IGetDocumentsOptions;
  private documents: GenericObject[];
  private model?: GenericObject;
  private count: number;
  private hasBeenCounted?: boolean;
  private hasBeenFetched?: boolean;

  constructor(name: string, schema: GenericObject) {
    this.name = name;
    this.schema = schema;
    this.count = 0;
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

  public getSchema(): GenericObject {
    return this.schema;
  }

  public getConstraints(): IGetDocumentsOptions {
    return this.constraints;
  }

  public withConstraints(constraints: IGetDocumentsOptions): this {
    this.constraints = constraints;
    return this;
  }

  public whereBy(constraint: IGetDocumentsOptions['whereBy']): this {
    this.constraints.whereBy = constraint;
    return this;
  }

  public whereOr(constraint: IGetDocumentsOptions['whereOr']): this {
    this.constraints.whereOr = constraint;
    return this;
  }

  public orderBy(constraint: IGetDocumentsOptions['orderBy']): this {
    this.constraints.orderBy = constraint;
    return this;
  }

  public limit(constraint: IGetDocumentsOptions['limit']): this {
    this.constraints.limit = constraint;
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

  private setDocuments(documents: GenericObject[]): void {
    this.documents = documents;
  }

  // Document Manager
  public Manager(): DocumentModelInstance<BaseDocument & GenericObject> {
    return createModel(this.name, this.schema);
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
function createRepository (name: string, schema: GenericObject): new () => ICollectionModel {
  return class Repository extends CollectionModel {
    constructor() {
      super(name, schema);
      return new CollectionModel(name, schema);
    }
  };
}

export { 
  CollectionModel,
  type ICollectionModel,
  createRepository,
};