import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * @function callFunction
 * @param {string} name - The name of the function to call
 * @param {object} payload - The data to send to the function
 * @returns {Promise<any>}
 */
export default async function callFunction(name: string, payload: object): Promise<any> {
  const functions = getFunctions();
  // Get a reference to the callable HTTPS trigger with the given name
  const functionRef = httpsCallable(functions, name);
  // call the function
  return functionRef(payload);
}
