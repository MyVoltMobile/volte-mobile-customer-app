import {
  authenticatedCustomerFetch,
} from '@/lib/customer/customer-api';

export type CustomerPromotion = {
  id: string;
  eyebrow: string | null;
  headline: string;
  description: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  showInApp: true;
  sortOrder: number;
};

type PromotionPayload = {
  ok?: unknown;
  promotions?: unknown;
  error?: unknown;
};

function cleanString(
  value: unknown,
) {
  if (
    typeof value !==
    'string'
  ) {
    return null;
  }

  const clean =
    value.trim();

  return clean || null;
}

function safeHttpsUrl(
  value: unknown,
) {
  const candidate =
    cleanString(value);

  if (!candidate) {
    return null;
  }

  try {
    const url =
      new URL(candidate);

    if (
      url.protocol !==
      'https:'
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function safeVoLTEMobileUrl(
  value: unknown,
) {
  const candidate =
    safeHttpsUrl(value);

  if (!candidate) {
    return null;
  }

  try {
    const hostname =
      new URL(candidate)
        .hostname
        .toLowerCase();

    if (
      hostname ===
        'voltemobile.com' ||
      hostname.endsWith(
        '.voltemobile.com',
      )
    ) {
      return candidate;
    }
  } catch {
    return null;
  }

  return null;
}

function normalizePromotion(
  value: unknown,
): CustomerPromotion | null {
  if (
    !value ||
    typeof value !==
      'object'
  ) {
    return null;
  }

  const record =
    value as Record<
      string,
      unknown
    >;

  const id =
    cleanString(
      record.id,
    );

  const headline =
    cleanString(
      record.headline,
    );

  if (
    !id ||
    !headline ||
    record.showInApp !==
      true
  ) {
    return null;
  }

  const numericSort =
    Number(
      record.sortOrder,
    );

  return {
    id,
    eyebrow:
      cleanString(
        record.eyebrow,
      ),
    headline,
    description:
      cleanString(
        record.description,
      ),
    imageUrl:
      safeHttpsUrl(
        record.imageUrl,
      ),
    ctaLabel:
      cleanString(
        record.ctaLabel,
      ),
    ctaUrl:
      safeVoLTEMobileUrl(
        record.ctaUrl,
      ),
    showInApp: true,
    sortOrder:
      Number.isFinite(
        numericSort,
      )
        ? numericSort
        : 100,
  };
}

export async function getCustomerPromotions() {
  const response =
    await authenticatedCustomerFetch(
      '/api/public/promotions',
      {
        method: 'GET',
      },
    );

  const payload =
    (await response.json()) as
      PromotionPayload;

  if (
    !response.ok ||
    payload.ok !==
      true ||
    !Array.isArray(
      payload.promotions,
    )
  ) {
    throw new Error(
      'VoLTE Mobile promotions could not be loaded.',
    );
  }

  return payload.promotions
    .map(
      normalizePromotion,
    )
    .filter(
      (
        promotion,
      ): promotion is CustomerPromotion =>
        promotion !==
        null,
    )
    .sort(
      (
        left,
        right,
      ) =>
        left.sortOrder -
        right.sortOrder,
    )
    .slice(
      0,
      8,
    );
}
