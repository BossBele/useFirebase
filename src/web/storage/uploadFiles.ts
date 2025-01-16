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
export default async function uploadFiles(files: StorageFile[], pathname: string, shouldSeparatePath?: boolean): Promise<{ images: string[], imagePaths: string[] }|UploadResult[]> {
  if (!files?.length) {
    throw new Error('No image/file passed');
  }

  const storage = getStorage();
  const uploadTasks:Promise<UploadResult>[] = files.map(async (file: StorageFile) => {
    const extensions = pathname.split('.');
    const extension = extensions[extensions.length - 1];
    let hasExtension = false;
    if (typeof extension === 'string' && extension?.length <= 4) {
      hasExtension = true;
    }
    const imagePath = hasExtension ? pathname : `${pathname}/${(file as File)?.name ?? Math.random().toString(36).substring(2)}`;
    const storageRef = ref(storage, imagePath);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
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
            resolve({ downloadURL, imagePath } as UploadResult);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });

  const results = await Promise.all(uploadTasks);

  if (shouldSeparatePath) {
    const images = results.map((result) => result.downloadURL);
    const imagePaths = results.map((result) => result.imagePath);
    return { images, imagePaths };
  }
  return results;
}
