import { collection as collectionFB, query as queryFB, where, orderBy as orderByFB, QueryConstraint, limit, Query } from 'firebase/firestore';
import getFirestore from './getFirestore';
import { IGetDocumentsOptions } from './types';

export default function generateQuery(collection: string, options?: IGetDocumentsOptions): Query {
  const firestore = getFirestore();

  const queries: QueryConstraint[] = [];
  if (options?.whereBy?.length) {
    options.whereBy.forEach(({ field, operator, value }) => {
      queries.push(where(field, operator, value));
    });
  }
  if (options?.orderBy?.length) {
    options.orderBy.forEach(({ field, direction }) => {
      queries.push(orderByFB(field, direction));
    });
  }
  if (options?.limit) {
    queries.push(limit(options?.limit));
  }

  const query = queryFB(
    collectionFB(firestore, collection),
    ...queries,
  );

  return query;
}