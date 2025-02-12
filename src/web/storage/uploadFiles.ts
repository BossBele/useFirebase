import type { StorageFile, UploadResult } from './types';
import uploadFile from './uploadFile';

/**
 * @function uploadFiles
 * @param {StorageFile[]} files
 * @param {string} pathname
 * @param {boolean} [shouldSeparatePath] - Whether output images and paths separately as array of strings or combine them as array of objects
 * @returns {Promise<{ images: string[], imagePaths: string[] }|UploadResult[]>}
 */
export default async function uploadFiles(files: StorageFile[], pathname: string, shouldSeparatePath?: boolean): Promise<{ files: string[], filePaths: string[] }|UploadResult[]> {
  if (!files?.length) {
    throw new Error('No images/files passed');
  }

  const uploadTasks:Promise<UploadResult>[] = files.map((file: StorageFile) => uploadFile(file, pathname));
  const results = await Promise.all(uploadTasks);

  if (shouldSeparatePath) {
    const files = results.map((result) => result.downloadURL);
    const filePaths = results.map((result) => result.filePath);
    return { files, filePaths };
  }
  return results;
}
