import { AggregateField } from "firebase-admin/firestore";
import { IGetDocumentsOptions } from "../../../web/database/firestore/types";
import generateQuery from "./generateQuery";

/**
 * @function getFieldSummation
 * Get summation of fields in matched documents
 * @param {string} collection - Firestore collection name
 * @param {string} aggregateField - Field to aggregate
 * @param {object} options - Query options
 * @returns {Promise<number>}
 */
export default async function getFieldSummation(collection: string, aggregateField: string, options?: IGetDocumentsOptions): Promise<number> {
  const query = generateQuery(collection, options);

  const snapshot = await query.aggregate({
    totalSummation: AggregateField.sum(aggregateField),
  }).get();

  return snapshot.data().totalSummation;
}