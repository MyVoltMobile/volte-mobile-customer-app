import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerIptvService = {
  id: string;
  serviceName: string;
  username: string | null;
  status: string | null;
  subscriptionStatus: string | null;
  maxConnections: number;
  amount: number;
  nextRenewalDate: string | null;
  expiresAt: string | null;
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

function textValue(
  value: unknown,
) {
  if (
    typeof value !== 'string'
  ) {
    return null;
  }

  const clean =
    value.trim();

  return clean || null;
}

function numberValue(
  value: unknown,
) {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed,
  )
    ? parsed
    : 0;
}

function normalize(
  value: unknown,
): CustomerIptvService | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    textValue(value.id);

  const serviceName =
    textValue(
      value.serviceName,
    );

  if (
    !id ||
    !serviceName
  ) {
    return null;
  }

  return {
    id,
    serviceName,

    username:
      textValue(
        value.username,
      ),

    status:
      textValue(
        value.status,
      ),

    subscriptionStatus:
      textValue(
        value.subscriptionStatus,
      ),

    maxConnections:
      Math.max(
        1,
        numberValue(
          value.maxConnections,
        ),
      ),

    amount:
      numberValue(
        value.amount,
      ),

    nextRenewalDate:
      textValue(
        value.nextRenewalDate,
      ),

    expiresAt:
      textValue(
        value.expiresAt,
      ),
  };
}

export async function getCustomerIptv() {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/customer-iptv',
      {
        method: 'GET',
      },
    );

  const raw =
    await response.json()
      .catch(
        () => null,
      );

  const payload =
    isRecord(raw)
      ? raw
      : null;

  if (
    !response.ok ||
    payload?.ok !== true ||
    payload.authenticated !==
      true ||
    !Array.isArray(
      payload.services,
    )
  ) {
    throw new Error(
      'Customer IPTV information could not be loaded.',
    );
  }

  return payload.services
    .map(normalize)
    .filter(
      (
        service,
      ): service is CustomerIptvService =>
        service !== null,
    );
}
