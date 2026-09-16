export const AUTH_INTENTS = [
  'sign-in',
  'create-account',
] as const;

export type AuthIntent =
  (typeof AUTH_INTENTS)[number];

export function parseAuthIntent(
  value:
    | string
    | string[]
    | undefined,
): AuthIntent | null {
  const candidate =
    Array.isArray(value)
      ? value[0]
      : value;

  if (
    candidate === 'sign-in' ||
    candidate === 'create-account'
  ) {
    return candidate;
  }

  return null;
}
