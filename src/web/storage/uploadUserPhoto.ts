import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import getStorage from './getStorage';

/**
 * @function uploadUserPhoto
 * @param {Blob} blobFile
 * @param {boolean} withoutDownloadLink
 * @returns {Promise<string>}
 */
export default async function uploadUserPhoto(blobFile: Blob, withoutDownloadLink?: boolean): Promise<string> {
  const storage = getStorage();
  const storageRef = ref(storage, `users/${window?.crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2)}-avatar.jpg`);
  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(storageRef, blobFile);
  if (withoutDownloadLink) {
    return snapshot.ref.fullPath;
  }
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}
