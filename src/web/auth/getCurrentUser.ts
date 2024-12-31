import { User } from "firebase/auth";
import getAuth from "./getAuth";

export default function getCurrentUser(): User | null {
  const auth = getAuth();
  return auth?.currentUser;
}
