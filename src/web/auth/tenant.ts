import getAuth from "./getAuth";

export async function getToken(): Promise<string> {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();
  return token;
}

export function setTenant(tenant: string): void {
  const auth = getAuth();
  auth.tenantId = tenant;
}

export function getTenant(): string | null {
  const auth = getAuth();
  return auth.currentUser?.tenantId;
}