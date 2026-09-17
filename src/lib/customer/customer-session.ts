export type CustomerSessionProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  address: string;
};

export type CustomerSessionResult = {
  ok: true;
  authenticated: true;
  customer: CustomerSessionProfile;
};

type CustomerSessionPayload = {
  ok?: unknown;
  authenticated?: unknown;
  customer?: unknown;
  error?: unknown;
};

function customerApiBaseUrl() {
  const configured =
    process.env
      .EXPO_PUBLIC_API_BASE_URL
      ?.trim() || '';

  if (!configured) {
    throw new Error(
      'VoLTE Mobile customer API configuration is missing.',
    );
  }

  const normalized =
    configured.replace(/\/+$/, '');

  if (!normalized.startsWith('https://')) {
    throw new Error(
      'VoLTE Mobile customer API configuration is invalid.',
    );
  }

  return normalized;
}

function isNullableString(
  value: unknown,
): value is string | null {
  return (
    typeof value === 'string' ||
    value === null
  );
}

function isCustomerSessionProfile(
  value: unknown,
): value is CustomerSessionProfile {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return false;
  }

  const candidate =
    value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    isNullableString(
      candidate.full_name,
    ) &&
    isNullableString(
      candidate.phone,
    ) &&
    isNullableString(
      candidate.email,
    ) &&
    typeof candidate.address === 'string'
  );
}

export async function getCustomerSession(
  accessToken: string,
): Promise<CustomerSessionResult> {
  const token = accessToken.trim();

  if (!token) {
    throw new Error(
      'Authenticated customer token is missing.',
    );
  }

  const response = await fetch(
    `${customerApiBaseUrl()}/api/public/customer-session`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  let payload:
    CustomerSessionPayload | null = null;

  try {
    payload =
      (await response.json()) as
        CustomerSessionPayload;
  } catch {
    payload = null;
  }

  const customer =
    payload?.customer;

  if (
    !response.ok ||
    payload?.ok !== true ||
    payload.authenticated !== true ||
    !isCustomerSessionProfile(customer)
  ) {
    throw new Error(
      'VoLTE Mobile customer account could not be verified.',
    );
  }

  return {
    ok: true,
    authenticated: true,
    customer,
  };
}
