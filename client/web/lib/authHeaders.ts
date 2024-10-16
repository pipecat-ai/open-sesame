export const DEMO_COOKIE_KEY = '__HOST-sandbox-token';

export default function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.SESAME_USER_TOKEN}`,
  };
}
