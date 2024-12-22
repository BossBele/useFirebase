import { ICollectionModel, IGetDocumentsOptions } from "../../../web/database/firestore/types";

export interface IDocumentsQueryOptions extends IGetDocumentsOptions {
  select?: string[],
  withSubcollections?: boolean,
}

export interface IAdminCollectionModel<T> extends ICollectionModel<T> {
  select(constraint: IDocumentsQueryOptions['select']): this,
  /**
   * @description Enables fetching subcollections of the documents
   */
  withSubcollections(): this,
}
