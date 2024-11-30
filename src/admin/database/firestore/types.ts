import { IGetDocumentsOptions } from "../../../web/database/firestore/types";

export interface IDocumentsQueryOptions extends IGetDocumentsOptions {
  select?: string[],
  withSubcollections?: boolean,
}
