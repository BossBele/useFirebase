import uploadFiles from './uploadFiles';
import type { StorageFile, UploadResult } from './types';

/**
 * @function uploadFile
 * @param {StorageFile} file
 * @param {string} pathname
 * @returns {Promise<UploadResult|null>}
 */
export default async function uploadFile(file: StorageFile, pathname: string): Promise<UploadResult|null> {
  const result = await uploadFiles([file], pathname) as UploadResult[];
  return result?.[0] ?? null;
}
