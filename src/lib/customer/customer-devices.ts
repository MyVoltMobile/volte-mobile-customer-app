import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerDeviceOwnershipType =
  | 'financed'
  | 'purchased'
  | 'assigned';

export type CustomerDevice = {
  id: string;
  displayName: string;
  brand: string | null;
  model: string | null;
  storage: string | null;
  color: string | null;
  imei: string | null;
  serialNumber: string | null;
  ownershipType:
    CustomerDeviceOwnershipType;
  purchaseDate: string | null;
  receiptNumber: string | null;
  financeStatus: string | null;
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

function normalizeOwnershipType(
  value: unknown,
): CustomerDeviceOwnershipType | null {
  if (
    value === 'financed' ||
    value === 'purchased' ||
    value === 'assigned'
  ) {
    return value;
  }

  return null;
}

function normalizeDevice(
  value: unknown,
): CustomerDevice | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    nullableString(value.id);

  const displayName =
    nullableString(
      value.displayName,
    );

  const ownershipType =
    normalizeOwnershipType(
      value.ownershipType,
    );

  if (
    !id ||
    !displayName ||
    !ownershipType
  ) {
    return null;
  }

  return {
    id,
    displayName,

    brand:
      nullableString(
        value.brand,
      ),

    model:
      nullableString(
        value.model,
      ),

    storage:
      nullableString(
        value.storage,
      ),

    color:
      nullableString(
        value.color,
      ),

    imei:
      nullableString(
        value.imei,
      ),

    serialNumber:
      nullableString(
        value.serialNumber,
      ),

    ownershipType,

    purchaseDate:
      nullableString(
        value.purchaseDate,
      ),

    receiptNumber:
      nullableString(
        value.receiptNumber,
      ),

    financeStatus:
      nullableString(
        value.financeStatus,
      ),
  };
}

export async function getCustomerDevices() {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/customer-devices',
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
      payload.devices,
    )
  ) {
    throw new Error(
      'Customer devices could not be loaded.',
    );
  }

  return payload.devices
    .map(normalizeDevice)
    .filter(
      (
        device,
      ): device is CustomerDevice =>
        device !== null,
    );
}
