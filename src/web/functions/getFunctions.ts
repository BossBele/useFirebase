import { getFunctions as getFunctionsFB, Functions } from 'firebase/functions';
import { getApp } from '..';
import type { FirebaseApp } from 'firebase/app';

export default function getFunctions(app?: FirebaseApp): Functions|null {
  if (getApp()) {
    const functions = getFunctionsFB(app);
    return functions;
  }
  return null;
}
