import cookies from '@boiseitguru/cookie-cutter';

export default function getSession(): string {
  return cookies.get("__session");
}
