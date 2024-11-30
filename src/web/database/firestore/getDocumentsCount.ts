import { getCountFromServer } from 'firebase/firestore';
import generateQuery from './generateQuery';
import { IGetDocumentsOptions } from './types';

export default async function getDocumentsCount(collection: string, constraints?: IGetDocumentsOptions): Promise<number> {
  const query = generateQuery(collection, constraints);

  const snapshot = await getCountFromServer(query);
  const recordsCount = snapshot.data().count;

  return recordsCount;
}
