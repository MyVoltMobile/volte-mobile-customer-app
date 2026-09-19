import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerFinanceAccount = {
  id: string;
  deviceName: string;
  totalPrice: number;
  monthlyPayment: number;
  balanceRemaining: number;
  status: string;
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

function text(
  value: unknown,
) {
  if (
    typeof value !==
    'string'
  ) {
    return null;
  }

  const cleaned =
    value.trim();

  return cleaned ||
    null;
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
): CustomerFinanceAccount | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    text(value.id);

  const deviceName =
    text(
      value.deviceName,
    );

  if (
    !id ||
    !deviceName
  ) {
    return null;
  }

  return {
    id,
    deviceName,

    totalPrice:
      numberValue(
        value.totalPrice,
      ),

    monthlyPayment:
      numberValue(
        value.monthlyPayment,
      ),

    balanceRemaining:
      numberValue(
        value.balanceRemaining,
      ),

    status:
      text(
        value.status,
      ) ||
      'Active',

    createdAt:
      text(
        value.createdAt,
      ),
  };
}

export async function getCustomerFinanceAccounts() {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/customer-finance',
      {
        method:
          'GET',
      },
    );

  const raw =
    await response
      .json()
      .catch(
        () => null,
      );

  const result =
    isRecord(raw)
      ? raw
      : null;

  if (
    !response.ok ||
    result?.ok !== true ||
    result.authenticated !==
      true ||
    !Array.isArray(
      result.accounts,
    )
  ) {
    throw new Error(
      'Finance information could not be loaded.',
    );
  }

  return result.accounts
    .map(normalize)
    .filter(
      (
        account,
      ): account is CustomerFinanceAccount =>
        account !== null,
    );
}
