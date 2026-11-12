import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerFinanceAccount = {
  id: string;
  installmentCheckoutEnabled: boolean;
  deviceName: string;
  originalFinancedAmount: number | null;
  nextDueDate: string | null;
  maturityDate: string | null;
  paymentFrequency: string | null;
  termMonths: number | null;
  monthlyPayment: number | null;
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
  installmentCheckoutEnabled: boolean,
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
    installmentCheckoutEnabled,
    deviceName,

    originalFinancedAmount: numberValue(value.originalFinancedAmount) || null,
    nextDueDate: text(value.nextDueDate),
    maturityDate: text(value.maturityDate),
    paymentFrequency: text(value.paymentFrequency),
    termMonths: numberValue(value.termMonths) || null,

    monthlyPayment:
      numberValue(
        value.monthlyPayment,
      ) || null,

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
    .map((account) => normalize(account, result.installmentCheckoutEnabled === true))
    .filter(
      (
        account,
      ): account is CustomerFinanceAccount =>
        account !== null,
    );
}

export async function startCustomerInstallmentCheckout(accountId: string) {
  const response = await authenticatedCustomerFetch('/api/public/customer-finance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountId }),
  });
  const result = await response.json().catch(() => null);
  const launchUrl = result?.checkout?.launchUrl;
  if (!response.ok || result?.ok !== true || typeof launchUrl !== 'string' ||
      !/^https:\/\/pay\.voltemobile\.com\/api\/customer-installments\/launch\/VLT-FI-[a-f0-9]{32}$/.test(launchUrl)) {
    throw new Error(typeof result?.error === 'string' ? result.error : 'Secure checkout could not be opened.');
  }
  return launchUrl;
}
