import admin from "../..";

const firestore = admin.firestore();

export default firestore;

export { createModel } from "./Model";
export { createRepository } from "./Repository";
export { default as deleteDocument } from "./deleteDocument";
export { default as deleteDocuments } from "./deleteDocuments";
export { default as generateQuery } from './generateQuery';
export { default as getCollectionRef } from './getCollectionRef';
export { default as getDocument } from './getDocument';
export { default as getDocumentBy } from './getDocumentBy';
export { default as getDocumentIds } from './getDocumentIds';
export { default as getDocumentRef } from './getDocumentRef';
export { default as getDocuments } from './getDocuments';
export { default as getDocumentsCount } from './getDocumentsCount';
export { default as getFieldSummation } from './getFieldSummation';
export { default as getFirestore } from './getFirestore';
export { default as listCollections } from './listCollections';
export { default as setDocument } from './setDocument';