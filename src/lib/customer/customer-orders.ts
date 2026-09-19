import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerOrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  storage: string | null;
  color: string | null;
};

export type CustomerOrder = {
  id: string;
  receiptNumber: string | null;
  createdAt: string | null;
  total: number;
  amountPaid: number;
  paid: boolean;
  orderStatus: string | null;
  items: CustomerOrderItem[];
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
  return typeof value === 'string'
    ? value
    : null;
}

function numericValue(
  value: unknown,
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function normalizeItem(
  value: unknown,
): CustomerOrderItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    nullableString(value.id);

  const name =
    nullableString(value.name);

  if (
    !id ||
    !name
  ) {
    return null;
  }

  return {
    id,
    name,
    quantity:
      numericValue(
        value.quantity,
      ),
    unitPrice:
      numericValue(
        value.unitPrice,
      ),
    lineTotal:
      numericValue(
        value.lineTotal,
      ),
    storage:
      nullableString(
        value.storage,
      ),
    color:
      nullableString(
        value.color,
      ),
  };
}

function normalizeOrder(
  value: unknown,
): CustomerOrder | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    nullableString(value.id);

  if (!id) {
    return null;
  }

  const rawItems =
    Array.isArray(value.items)
      ? value.items
      : [];

  const items =
    rawItems
      .map(normalizeItem)
      .filter(
        (
          item,
        ): item is CustomerOrderItem =>
          item !== null,
      );

  return {
    id,
    receiptNumber:
      nullableString(
        value.receiptNumber,
      ),
    createdAt:
      nullableString(
        value.createdAt,
      ),
    total:
      numericValue(
        value.total,
      ),
    amountPaid:
      numericValue(
        value.amountPaid,
      ),
    paid:
      value.paid === true,
    orderStatus:
      nullableString(
        value.orderStatus,
      ),
    items,
  };
}

export async function getCustomerOrders() {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/customer-orders',
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
      payload.orders,
    )
  ) {
    throw new Error(
      'Customer orders could not be loaded.',
    );
  }

  return payload.orders
    .map(normalizeOrder)
    .filter(
      (
        order,
      ): order is CustomerOrder =>
        order !== null,
    );
}
