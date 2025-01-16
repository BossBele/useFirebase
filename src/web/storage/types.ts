export type StorageFile = File|Blob|Uint8Array|ArrayBuffer;

export interface UploadResult {
  downloadURL: string,
  imagePath: string,
}
