import { getDocs } from 'firebase/firestore';
import { GenericObject, IGetDocumentsOptions } from './types';
import generateQuery from './generateQuery';

export default async function getDocuments(collection: string, options: IGetDocumentsOptions): Promise<GenericObject[]> {
  const query = generateQuery(collection, options);

  const querySnapshot = await getDocs(query);

  const results: GenericObject[] = [];
  querySnapshot.forEach((doc) => {
    results.push({ ...doc.data(), id: doc.id });
  });

  return results;
}