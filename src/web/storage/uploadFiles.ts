import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import getStorage from './getStorage';
import type { StorageFile, UploadResult } from './types';

/**
 * @function uploadFiles
 * @param {StorageFile[]} files
 * @param {string} pathname
 * @param {boolean} [shouldSeparatePath] - Whether output images and paths separately as array of strings or combine them as array of objects
 * @returns {Promise<{ images: string[], imagePaths: string[] }|UploadResult[]>}
 */
export default async function uploadFiles(files: StorageFile[], pathname: string, shouldSeparatePath?: boolean): Promise<{ files: string[], filePaths: string[] }|UploadResult[]> {
  if (!files?.length) {
    throw new Error('No image/file passed');
  }

  const storage = getStorage();
  const uploadTasks:Promise<UploadResult>[] = files.map(async (file: StorageFile) => {
    return new Promise((resolve, reject) => {
      const extensions = pathname.split('.');
      const extension = extensions[extensions.length - 1];
      let hasExtension = false;
      if (typeof extension === 'string' && extension?.length <= 4) {
        hasExtension = true;
      }
      const filePath = hasExtension ? pathname : `${pathname}/${(file as File)?.name ?? Math.random().toString(36).substring(2)}`;
      const storageRef = ref(storage, filePath);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            case 'canceled':
              console.log('Upload is canceled');
              break;
            case 'success':
              console.log('Upload is completed');
              break;
            case 'error':
              console.log('Upload is completed');
              break;
            default:
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ downloadURL, filePath } as UploadResult);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });

  const results = await Promise.all(uploadTasks);

  if (shouldSeparatePath) {
    const files = results.map((result) => result.downloadURL);
    const filePaths = results.map((result) => result.filePath);
    return { files, filePaths };
  }
  return results;
}
