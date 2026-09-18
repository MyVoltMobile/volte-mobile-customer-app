import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerEsim = {
  id: string;
  planName: string;
  description: string | null;
  region: string | null;
  countryCodes: string[];
  dataAllowance: string | null;
  validityDays: number | null;
  status: string | null;
  quantity: number;
  msisdn: string | null;
  iosInstallUrl: string | null;
  androidInstallUrl: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
  createdAt: string | null;
};

type UnknownRecord =
  Record<string, unknown>;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function nullableString(
  value: unknown,
) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized =
    value.trim();

  return normalized || null;
}

function numberOrNull(
  value: unknown,
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function stringArray(
  value: unknown,
) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ): item is string =>
        typeof item === 'string',
    )
    .map(
      (item) =>
        item.trim(),
    )
    .filter(Boolean);
}

function normalizeEsim(
  value: unknown,
): CustomerEsim | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    nullableString(
      value.id,
    );

  const planName =
    nullableString(
      value.planName,
    );

  if (
    !id ||
    !planName
  ) {
    return null;
  }

  return {
    id,
    planName,

    description:
      nullableString(
        value.description,
      ),

    region:
      nullableString(
        value.region,
      ),

    countryCodes:
      stringArray(
        value.countryCodes,
      ),

    dataAllowance:
      nullableString(
        value.dataAllowance,
      ),

    validityDays:
      numberOrNull(
        value.validityDays,
      ),

    status:
      nullableString(
        value.status,
      ),

    quantity:
      numberOrNull(
        value.quantity,
      ) ?? 1,

    msisdn:
      nullableString(
        value.msisdn,
      ),

    iosInstallUrl:
      nullableString(
        value.iosInstallUrl,
      ),

    androidInstallUrl:
      nullableString(
        value.androidInstallUrl,
      ),

    activatedAt:
      nullableString(
        value.activatedAt,
      ),

    expiresAt:
      nullableString(
        value.expiresAt,
      ),

    createdAt:
      nullableString(
        value.createdAt,
      ),
  };
}

export async function getCustomerEsims() {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/customer-esims',
      {
        method: 'GET',
      },
    );

  let payload:
    UnknownRecord | null = null;

  try {
    const raw =
      await response.json();

    payload =
      isRecord(raw)
        ? raw
        : null;
  } catch {
    payload = null;
  }

  if (
    !response.ok ||
    payload?.ok !== true ||
    payload.authenticated !== true ||
    !Array.isArray(
      payload.esims,
    )
  ) {
    throw new Error(
      'Customer eSIMs could not be loaded.',
    );
  }

  return payload.esims
    .map(normalizeEsim)
    .filter(
      (
        esim,
      ): esim is CustomerEsim =>
        esim !== null,
    );
}
