import getAuth from "./getAuth";

export async function getToken(): Promise<string> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  return token;
}

export function setTenant(tenant: string): void {
  const auth = getAuth();
  if (auth) {
    auth.tenantId = tenant;
  }
}

export function getTenant(): string | null {
  const auth = getAuth();
  if (auth) {
    return auth.currentUser?.tenantId;
  }
  return null;
}