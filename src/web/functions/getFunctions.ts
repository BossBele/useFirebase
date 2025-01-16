import { getFunctions as getFunctionsFB, Functions } from 'firebase/functions';
import { getApps } from '..';
import type { FirebaseApp } from 'firebase/app';

export default function getFunctions(app?: FirebaseApp): Functions|null {
  if (getApps()?.length) {
    const functions = getFunctionsFB(app);
    return functions;
  }
  return null;
}
