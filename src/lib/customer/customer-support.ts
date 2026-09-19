import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerSupportRequest = {
  id: string;
  status: string;
  topic: string;
  message: string;
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
  return typeof value ===
    'string'
    ? value.trim()
    : '';
}

function normalize(
  value: unknown,
): CustomerSupportRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  const id =
    text(value.id);

  const topic =
    text(value.topic);

  if (
    !id ||
    !topic
  ) {
    return null;
  }

  return {
    id,

    status:
      text(
        value.status,
      ) ||
      'New',

    topic,

    message:
      text(
        value.message,
      ),

    createdAt:
      text(
        value.createdAt,
      ) ||
      null,
  };
}

async function payload(
  response: Response,
) {
  const raw =
    await response
      .json()
      .catch(
        () => null,
      );

  return isRecord(raw)
    ? raw
    : null;
}

export async function getCustomerSupportRequests() {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/customer-support',
      {
        method:
          'GET',
      },
    );

  const result =
    await payload(
      response,
    );

  if (
    !response.ok ||
    result?.ok !== true ||
    result.authenticated !==
      true ||
    !Array.isArray(
      result.requests,
    )
  ) {
    throw new Error(
      'Support history could not be loaded.',
    );
  }

  return result.requests
    .map(normalize)
    .filter(
      (
        item,
      ): item is CustomerSupportRequest =>
        item !== null,
    );
}

export async function createCustomerSupportRequest({
  topic,
  message,
}: {
  topic: string;
  message: string;
}) {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/customer-support',
      {
        method:
          'POST',

        headers: {
          'Content-Type':
            'application/json',
        },

        body:
          JSON.stringify({
            contextType:
              'general',

            topic,

            message,
          }),
      },
    );

  const result =
    await payload(
      response,
    );

  const created =
    normalize(
      result?.request,
    );

  if (
    !response.ok ||
    result?.ok !== true ||
    result.authenticated !==
      true ||
    !created
  ) {
    throw new Error(
      text(
        result?.error,
      ) ||
      'Support request could not be created.',
    );
  }

  return created;
}
