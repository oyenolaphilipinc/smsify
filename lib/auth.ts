import { GetServerSidePropsContext } from 'next';
import { parseCookies } from 'next-cookies';

export function isAuthenticated(ctx: GetServerSidePropsContext): boolean {
  const cookies = parseCookies(ctx);
  return cookies.auth === 'true';
}
