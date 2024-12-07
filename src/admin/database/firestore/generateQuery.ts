import { DocumentData, Query } from "firebase-admin/firestore";
import getFirestore from "./getFirestore";
import { IDocumentsQueryOptions } from "./types";

export default function generateQuery(collection: string, options?: IDocumentsQueryOptions): Query<DocumentData, DocumentData> {
  const firestore = getFirestore();

  const store = firestore.collection(collection);

  let queries: Query<DocumentData, DocumentData> = store;
  if (options?.whereBy?.length) {
    queries = options.whereBy.reduce((prev, {
      field, operator, value,
    }) => prev.where(field, operator, value), queries);
  }

  if (options?.orderBy?.length) {
    queries = options.orderBy.reduce(
      (prev, { field, direction }) => prev.orderBy(field, direction),
      queries,
    );
  }

  if (options?.limit) {
    queries = queries.limit(options.limit);
  }

  if (options?.select) {
    queries = queries.select(...options.select);
  }

  return queries;
}
