import {
  getDatabase, ref, child, get, update, onValue, remove,
} from 'firebase/database';

export async function isNodeExists(path) {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, path));
  return snapshot.exists();
}

export function getUpdates(path, runUpdate) {
  const db = getDatabase();
  const pathRef = ref(db, path);
  onValue(pathRef, (snapshot) => {
    const data = snapshot.val();
    runUpdate(data);
  });
}

export function readOnce(path) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, path)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    }
    // console.log('No data available');
    return null;
  }).catch((error) => {
    console.error(error);
  });
}

export function commitUpdate(path, form) {
  const db = getDatabase();

  const updates = {
    ...form,
    updatedAt: new Date(),
  };
  // Get a key for a new Post.
  // const newPostKey = push(child(ref(db), path)).key;
  return update(ref(db, path), updates);
}

export function deleteData(path) {
  const db = getDatabase();
  return remove(ref(db, path));
}
